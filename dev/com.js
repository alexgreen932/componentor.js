// componentor.js
import * as componentMethods from './methods/index.js';
import DebugTools from './functions/DebugTools.js'

/**
 * The main function for defining custom components.
 * It uses your provided options (args) to set up the component.
 */
function com(args) {
  customElements.define(
    args.name,
    class extends HTMLElement {
      constructor() {
        super();

        // Store component arguments and set up properties
        this.args = args;
        this.dynamicKeys = [];
        this.r = 'r' in args ? args.r : 'data-updated';

        // Auto-bind imported component methods from "./methods/index.js"
        Object.entries(componentMethods).forEach(([name, fn]) => {
          this[name] = fn.bind(this);
        });

        //aliases to method for shorthand
        this.l = this.log;

        // Bind local component methods if provided in args
        this.methods = args.methods || {};
        if (args.methods) {
          Object.entries(args.methods).forEach(([key, fn]) => {
            this[key] = fn.bind(this);
          });
        }

        // Set template function (or provide a fallback)
        this.tpl = args.tpl || (() => `<div>Component template (tpl) is missing</div>`);

        // Prepare data and initial render
        this.getData();  // Assumes getData() defined in your component methods or args
        this.render();
        this.simple_reactivity();



        // Attach re-render listener for live updates
        if (this.r) {
          // this.render();
          // console.log(`[${this.tagName}] rerendered NOT false`);
          //todo correct for debugger
          // document.addEventListener(this.r, () => {
          //   console.log(`[${this.tagName}] r is ${this.r}`);

          //   const start = performance.now();
          //   this.render();
          //   const end = performance.now();
          //   // Log component re-render with performance metrics
          //   if (app.debug) {
          //     logComponentRender(this.tagName, end - start);
          //   }
          // });
        }

        // Execute mount hook, if any
        if (args.mount) {
          if (typeof args.mount === 'function') {
            args.mount.call(this);
          } else if (Array.isArray(args.mount)) {
            args.mount.forEach(fn => fn.call(this));
          }
        }

        // Live component inspector:
        // Clicking the component while holding Ctrl triggers an inspect action.
        this.addEventListener('click', (e) => {
          if (app.debug && e.ctrlKey) {
            app.inspectComponent(this);
          }
        });


        document.addEventListener('data-updated', () => {
          console.log(`[${this.tagName}] event catched`);
          if (this.r === 'data-updated') {
            console.log(`[${this.tagName}] event matches`);
            this.render();
          }else{
            console.log(`[${this.tagName}] event "${this.r}" Not matches`);
          }
        });
      }

      /**
       * Renders the component by processing the template and binding events.
       */
      render() {
        let tpl = this.template();
        tpl = this.doAttr(tpl);
        tpl = this.doFor(tpl); // Process j-for first
        tpl = this.doIf(tpl);  // Then process j-if
        tpl = this.doInterpolation(tpl);

        this.innerHTML = tpl;  // Insert into the DOM

        this.jModel();         // Bind live DOM elements
        this.doEvents();       // Attach event listeners
      }

      //preloader method
      preloader(condition, tpl = null) {
        // console.log('condition: ', condition);

        if (condition) return;
        if (tpl) return tpl;
        return `<div>Loading...</div>`;
        //to add a listener if this.loadTpl not false, null or '' rerendering by calling this.render()  

      }

      /**
       * Returns the template HTML.
       */
      template() {
        return typeof this.tpl === 'function' ? this.tpl() : this.tpl;
      }

      /**
       * Dispatches a custom event to trigger reactivity.
       */
      e(eventName = this.r || 'data-updated') {
        const event = new Event(eventName, { bubbles: true });
        // console.log('eventName------------- ', eventName);
        this.dispatchEvent(event);
      }

      /**
       * Sets up simple reactivity on dynamic keys.
       */
      simple_reactivity() {
        let keys = this.dynamicKeys;
        keys.forEach(key => {
          const events = ['change', 'input', 'select', 'keyup'];
          let dynamicObj = this[key];
          events.forEach(event => {
            this.addEventListener(event, e => {
              if (dynamicObj && e.target.id) {
                dynamicObj[e.target.id] = e.target.value;
              }
            });
          });
        });
      }
    }
  );

  // Register component information in the debug log if debug is active
  if (typeof app !== 'undefined' && app.debug) {
    app.components.push({
      name: args.name,
      data: args.data || {},
      methods: args.methods ? Object.keys(args.methods) : [],
      renders: 1 // initial render count
    });
  }
}

/**
 * Logs a render update for a component.
 * It updates the render count and records the last render time.
 */
function logComponentRender(name, renderTime) {
  // Find the component in the debug log and update render count
  let comp = app.components.find(c => c.name.toUpperCase() === name.toUpperCase());
  if (comp) {
    comp.renders = (comp.renders || 0) + 1;
    comp.lastRenderTime = renderTime;
  }
}

// Export the 'com' function for module usage
export { com };

