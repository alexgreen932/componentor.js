import { isStaticOrDynamic, j_escape } from './help-functions.js';
//todo rm depricated, replased with j_props

export default function j_props() {

    let parentElement = this.getAttribute('parent-data');

    if (!parentElement) {
        //todo dev
        // Info: Standalone components (without parent) can still have static props.
        //console.warn(`[${this.tagName}] Parent component not found. Assuming static props if provided.`);
        // Don't return yet — allow processing static (#) attributes.
    }

    let parent = parentElement ? this.closest(parentElement) : null;

    for (const attr of this.attributes) {
        //props 'p:' ------------------
        if (attr.name.startsWith('p:')) {
            const key = attr.name.slice(2);
            const value = attr.value;

            // Check if it's static (number, boolean, string in quotes)
           
            const dynamicData = isStaticOrDynamic(parent, attr.value);

            // this.j_deb('com-attr2', [ [dynamicData] ]);
            
            if ( typeof dynamicData == 'string') {;
               this.log('Warn', `Prop "${key}" is a string - "${dynamicData}". It is recommended to use an Object or Array for props. You can have problem with reactivity and two way binding. String props will be supported in future versions.`) 
               console.warn('Warn', `Prop "${key}" is a string - "${dynamicData}". It is recommended to use an Object or Array for props. You can have problem with reactivity and two way binding. String props will be supported in future versions.`) 
            } 


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


