// componentor.js
import { resolveDataPath } from './src/functions.js';
import processAttr from './src/processAttr.js';
import processEvents from './src/processEvents.js';
import processFor from './src/processFor.js';
import processIf from './src/processIf.js';
import getData from './src/getData.js';
import eventHandler from './src/eventHandler.js';

function com(args) {
	customElements.define(
		args.name,
		class extends HTMLElement {
			constructor() {
				super();
				this.args = args;
				this.dynamicKeys = [];
				this.r = args.r || 'data-updated';

				this.processAttr = processAttr.bind(this);
				this.processEvents = processEvents.bind(this);
				this.processFor = processFor.bind(this);
				this.processIf = processIf.bind(this);
				this.getData = getData.bind(this);
				this.eventHandler = eventHandler.bind(this);//execute method or changes data on events

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
				tpl = this.processAttr(tpl);
				tpl = this.processFor(tpl); // Process j-for first
				tpl = this.processIf(tpl);  // Then process j-if
				tpl = this.processInterpolation(tpl);
				this.innerHTML = tpl;
				this.processEvents();
			}

			proxy(data) {
				const component = this;
				return new Proxy(data, {
					get(target, property) {
						return target[property];
					},
					set(target, property, value) {
						target[property] = value;
						const event = new Event('data-updated', { bubbles: true });
						component.dispatchEvent(event); // dispatch from the component

						// console.log(`%c [proxy] property "${property}" changed -> "${value}"`,'color: green'); //no log
						return true;
					}
				});
			}


			//add custom events app
			e(e = this.r || 'data-updated') {
				const event = new Event(e, { bubbles: true });
				this.dispatchEvent(event);
			}

			//execute method function on component event
			executeMethod(methodKey) {
				let methodName, args = null, argArray = [];
				const match = methodKey.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
				if (match) {
					methodName = match[1];
					let args = null;
					if (match[2]) {
						args = match[2];
						if (args) {
							if (args.includes(',')) {
								args.split(',').forEach(arg => {
									arg = arg.trim();
									console.log('arg: ', arg);
									let val = this.getDynamicData(arg);
									argArray.push(val);
								});

							} else {
								let val = this.getDynamicData(args);
								argArray.push(val);

							}
						}
					}
					console.log('methodName: ', methodName);
					console.log('args: ', args);
					if (methodName) {
						if (typeof this[methodName] === 'function') {
							this[methodName](...argArray); // Execute function with arguments
						}else {
							console.warn(` [${this.tagName}] ${methodName} is not a function`);
							console.log('methodName: ', methodName);
							console.log('args: ', args);
						}
					}
				} else {
					//something for log
				}
			}


			processInterpolation(tpl) {
				if (!tpl.includes('{{')) return tpl;
				return tpl.replace(/{{(.*?)}}/g, (_, path) => {
					const resolvedValue = resolveDataPath(this, path.trim());
					return resolvedValue !== undefined ? resolvedValue : '';
				});
			}

			//get dynamic data if value is a property of any of component object, returns if it's static value
			getDynamicData(val) {
				// console.log('val: ', val);
				// 	console.log('this.dynamicKeys: ', this.dynamicKeys);
				if (this.dynamicKeys.length) {
					this.dynamicKeys.forEach(key => {
						if (val.startsWith(`${key}.`)) {
							val = resolveDataPath(this, val);
							// console.log('${key}.: ', `${key}.`);
						}
					});
				}
				return val;
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
