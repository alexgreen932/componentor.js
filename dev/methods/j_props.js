import { isStaticOrDynamic, j_escape } from './help-functions.js';
//todo rm depricated, replased with j_props

export default function j_props() {

    let parentElement = this.getAttribute('parent-data');

    if (!parentElement) {
        // Info: Standalone components (without parent) can still have static props.
        console.warn(`[${this.tagName}] Parent component not found. Assuming static props if provided.`);
        // Don't return yet — allow processing static (#) attributes.
    }

    let parent = parentElement ? this.closest(parentElement) : null;

    for (const attr of this.attributes) {
        // prop: ------------
        if (attr.name.startsWith('prop:')) {
            const key = attr.name.slice(5);
            const dynamicData = isStaticOrDynamic(parent, attr.value);

            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
                // You can later track dynamicKeys if needed.
            } else {
                console.warn(`[${this.tagName}] Failed to resolve prop "${key}" from path "${attr.value}"`);
            }
        }

        // p: ------------------
        if (attr.name.startsWith('p:')) {
            const key = attr.name.slice(2);
            const value = attr.value;

            // Check if it's static (number, boolean, string in quotes)
           
            const dynamicData = isStaticOrDynamic(parent, attr.value);
            // Note: passing null to parent, because standalone means no parent needed.

            if (dynamicData !== undefined) {
                this[key] = this.proxy(dynamicData || {});
            } else {
                console.warn(`[${this.tagName}] Static prop "#${key}" is not valid static value: ${value}`);
            }
        }
        // # ------------------
        if (attr.name.startsWith('#')) {
            const key = attr.name.slice(1);
            const value = attr.value;

            // Check if it's static (number, boolean, string in quotes)
            const staticValue = j_escape(value); 
            // Note: passing null to parent, because standalone means no parent needed.

            if (staticValue !== undefined) {
                this[key] = this.proxy({st:staticValue});
            } else {
                console.warn(`[${this.tagName}] Static prop "#${key}" is not valid static value: ${value}`);
            }
        }

    }
}


