// import { resolveDataPath } from './src/functions.js';

//refactored import
import * as componentMethods from './methods/index.js';

function com(args) {
	customElements.define(
		args.name,
		class extends HTMLElement {
			constructor() {
				super();
				this.args = args;
				this.dynamicKeys = [];
				this.r = args.r || 'data-updated';

				// ✅ Auto-bind all imported component methods
				Object.entries(componentMethods).forEach(([name, fn]) => {
					this[name] = fn.bind(this);
				});


				this.methods = args.methods || {};
				if (args.methods) {
					Object.entries(args.methods).forEach(([key, fn]) => {
						this[key] = fn.bind(this);
					});
				}

				this.tpl = args.tpl || (() => `<div>Component tpl method is missing</div>`);
				///this.data = this.proxy(args.data || {}); // wrap data in proxy //no need, getData makes it as main object can be not this.data only this.el, this.list any props
				this.getData();
				this.render();
				this.simple_reactivity();

				// Attach re-render listener once
				if (this.r) {
					document.addEventListener(this.r, () => {
						this.render();
						// console.log(`%c Component [${this.tagName}] rerendered due to event "${this.r}"`,'background:#0ff; padding:3px;');
					});
				}

				if (args.mount) {
					if (typeof args.mount === 'function') {
						args.mount.call(this);
					} else if (Array.isArray(args.mount)) {
						args.mount.forEach(fn => fn.call(this));
					}
				}
			}

			render() {
				let tpl = this.tpl();
				tpl = this.doAttr(tpl);
				tpl = this.doFor(tpl); // Process j-for first
				tpl = this.doIf(tpl);  // Then process j-if
				tpl = this.doInterpolation(tpl);
				this.innerHTML = tpl;
				this.doEvents();
			}



			//add custom events app
			e(e = this.r || 'data-updated') {
				const event = new Event(e, { bubbles: true });
				this.dispatchEvent(event);
			}



			//todo peplace with j-model
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
}

// Export for module usage
export { com };

// Expose globally
(function (global) {
	global.app = {
		com,
	};
})(window);
