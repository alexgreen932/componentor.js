// com.js
// Jet.js Component Definition System

import * as componentMethods from './methods/index.js';
import DebugTools from './functions/DebugTools.js';
import { resolveDataPath } from './methods/help-functions.js';

/**
 * Main function to register a custom Jet component
 * @param {Object} args - Component definition object
 */
function com(args) {
  customElements.define(
    args.name,
    class extends HTMLElement {
      constructor() {
        super(); // Always call super() in custom element constructor

        // 1. Store provided options
        this.args = args;
        this.methods = args.methods || {}; // Local methods
        this.r = 'r' in args ? args.r : 'data-updated'; // Reactive event name
        this.$data = args.data || {};


        //css add style if property args.css is provided
        if (args.css) {
          const id = `jet-style-${args.name}`;
          if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.innerText = args.css;
            document.head.appendChild(style);
          }
        }



        // 2. Bind shared utility methods from './methods/index.js'
        Object.entries(componentMethods).forEach(([name, fn]) => {
          this[name] = fn.bind(this);
        });

        //new data

        // Reserved keys we should never overwrite with user data and user methods
        const reserved = [
          'args', 'methods', 'r', 'tpl', 'render', 'connectedCallback',
          'disconnectedCallback', 'e', 'log', 'l', 'proxy', 'querySelector',
          'querySelectorAll', 'jModel', ...Object.keys(componentMethods)
        ];

        this.proxyData = this.proxy(this.$data); // Optional: keep a reference for debugging

        for (const key in this.proxyData) {
          if (!reserved.includes(key)) {
            Object.defineProperty(this, key, {
              get: () => this.proxyData[key],
              set: (val) => { this.proxyData[key] = val }
            });
          }
        }


        // Bind local component methods
        Object.entries(this.methods).forEach(([name, fn]) => {
          if (!reserved.includes(name)) {
            this[name] = fn.bind(this);
          } else {
            //todo add pusLog
          }

        });


        //used in child components
        this.processProps();



        //activate save data in localstorage if property provided
        if (args.saveLocally) {
          console.log('args.saveLocally: ', args.saveLocally);
          const localArgs = typeof args.saveLocally === 'function' ? args.saveLocally.call(this) : args.saveLocally;
          this.setupLocalSave(localArgs);
        }


        // 4. Shorthand aliases (optional, can be removed later)
        this.l = this.log;//todo remove

        // 5. Lifecycle: created()
        if (typeof args.created === 'function') {
          args.created.call(this);
        }

        // 6. Register lifecycle hooks for later
        if (typeof args.updated === 'function') this.updated = args.updated;
        if (typeof args.destroyed === 'function') this.destroyed = args.destroyed;
        if (typeof args.connected === 'function') this.connected = args.connected;

        this.tpl = args.tpl || (() => `<div>Component template (tpl) is missing</div>`);
        // 7. Prepare data + render component

        this.render();  // Do first render before mount

        // 9. Lifecycle: mount()
        if (args.mount) {
          if (typeof args.mount === 'function') {
            args.mount.call(this);
          } else if (Array.isArray(args.mount)) {
            args.mount.forEach(fn => fn.call(this));
          }
        }



        // 10. Setup global re-render listener if "r" is defined (default: 'data-updated')
        if (this.r) {
          document.addEventListener(this.r, () => {
            const start = performance.now();
            this.render();
            // console.log(`%c"[${this.tagName}]" reRendered data current_page is "${this.data.current_page}, title ia "${this.data.current_page_title}"`, 'background:#00f; color:#fff; padding:3px; font-weight:bold;');         
            const end = performance.now();
            //TODO DEBAG
            if (app.devtoolsEnabled) {
              logComponentRender(this.tagName, end - start);
            }
          });
        }

        // 11. Debug inspect mode (Ctrl+Click)
        this.addEventListener('click', (e) => {
          if (app.devtoolsEnabled && e.ctrlKey) {
            app.inspectComponent(this);
          }
        });
        //end of constructor 
      }

      // Native lifecycle hook: element added to DOM
      connectedCallback() {
        if (typeof this.connected === 'function') {
          this.connected();
        }
      }

      // Native lifecycle hook: element removed from DOM
      disconnectedCallback() {
        if (typeof this.destroyed === 'function') {
          this.destroyed();
        }
      }

      /**
       * Renders component HTML
       */
      render() {
        let tpl = this.template();             // Get raw template string
        tpl = this.doLoader(tpl);              // Handle j-load
        tpl = this.doAttr(tpl);                // Handle j-attr (if any)
        tpl = this.doFor(tpl);                 // Handle j-for loops
        tpl = this.doIf(tpl);                  // Handle j-if conditions
        tpl = this.doInterpolation(tpl);       // Replace {{}} with actual data

        this.innerHTML = tpl;                  // Inject into DOM
        this.jModel();                         // Two-way binding support
        this.doEvents();                       // Add event listeners (@click, etc.)
      }

      /**
       * Returns the component's HTML template string
       */
      template() {
        return typeof this.tpl === 'function' ? this.tpl() : this.tpl;
      }

      /**
       * Triggers reactivity event manually
       */
      e(eventName = this.r || 'data-updated') {
        const event = new Event(eventName, { bubbles: true });
        this.dispatchEvent(event);
      }

    }
  );

  // Add to debug panel if in dev mode
  if (typeof app !== 'undefined' && app.devtoolsEnabled) {
    app.components.push({
      name: args.name,
      data: args.data || {},
      methods: args.methods ? Object.keys(args.methods) : [],
      renders: 1
    });
  }
}

/**
 * Debug helper: Track render performance and count
 */
function logComponentRender(name, renderTime) {
  let comp = app.components.find(c => c.name.toUpperCase() === name.toUpperCase());
  if (comp) {
    comp.renders = (comp.renders || 0) + 1;
    comp.lastRenderTime = renderTime;
  }
}

// Restore Ctrl+Click inspect
// doublicated
// this.addEventListener('click', (e) => {
//   if (e.ctrlKey && typeof app.inspectComponent === 'function') {
//     app.inspectComponent(this);
//   }
// });

export { com };
