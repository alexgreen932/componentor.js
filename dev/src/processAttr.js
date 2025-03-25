import { resolveDataPath } from './functions.js';

//todo move func in function.js
function getElementsByAttributePrefix(prefixes, str, type = '*') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll(type);
    const matchedElements = [];

    elements.forEach(el => {
        for (const attr of el.attributes) {
            if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
                matchedElements.push(el);
                break; // Stop after the first matching attribute
            }
        }
    });

    return { doc, matchedElements };
}

export default function processAttr(tpl) {
    const { doc, matchedElements } = getElementsByAttributePrefix(['el', ':', '@'], tpl);

    matchedElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            const value = attr.value.trim();
            //it works with attrs starting with : and el, but removed for shorten for now

            // Props
            if (attr.name.startsWith('el:') || attr.name === 'el') {
                el.setAttribute('data-parent', this.tagName.toLowerCase());
            }

            // Dynamic attributes
            if (attr.name.startsWith(':')) {
                const key = attr.name.slice(1);
                if (key === 'class') {
                    value.split(',').map(cls => cls.trim()).forEach(cls => {
                        // if (this.data[cls]) {
                        el.classList.add(resolveDataPath(this, cls));
                        // }
                    });
                } else {
                    // el.setAttribute(key, this.data[value] || value);//todo
                }
                el.removeAttribute(attr.name);
            }

            // Event handlers
            if (attr.name.startsWith('@')) {
                const event = attr.name.slice(1);
                // console.log('event: ', event);

                //if set new value to property
                if (value.match(/=/i)) {
                    const [prop, val] = value.split('=').map(s => s.trim());
                    el.setAttribute('data-event', event);
                    el.setAttribute('data-prop', prop);
                    el.setAttribute('data-newvalue', val);

                } else {
                    //via else because it adds data-method to above too
                    // Extract function name and arguments from the value
                    const match = value.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
                    // console.log('match: ', match);
                    if (match) {
                        // console.log('match------ ', match);
                        const methodName = match[1];
                        // const args = match[2] ? match[2].split(',').map(arg => arg.trim().replace(/^['"](.*)['"]$/, '$1')) : [];//no need to remove quotes here, by them it will detect if it static or dynamic

                        el.setAttribute('data-event', event);
                        el.setAttribute('data-method', methodName);
                        //new set args dynamic value on this stage if it matches existing objects, not as array
                        // console.log('match[2]------- ', match[2]);
                        // const args = match[2] ? match[2].split(',').map(arg => arg.trim()) : [];//old
                        let args = null;
                        if (match[2] && match[2].match(/,/i)) {
                            const args = match[2].split(',').map(arg => {
                                arg = this.getDynamicData(arg);
                            }).join(', ');
                        }else if(match[2]){
                            args =this.getDynamicData(match[2]);
                        }
                                // console.log('args----------- ', args);
                        el.setAttribute('data-args', JSON.stringify(args)); // Store arguments safely
                    } else {
                        el.setAttribute('data-event', event);
                        el.setAttribute('data-method', value);
                    }
                }
                el.removeAttribute(attr.name);
                this.processEvents();
                // this.processEvents(el.outerHTML);
            }
        });
    });

    return doc.body.innerHTML;
}


