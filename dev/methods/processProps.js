import { resolveDataPath, cB } from './help-functions.js';

console.log('process props loaded');
export default function processProps() {
    // console.log('process props loaded inside');

    let parentElement = this.getAttribute('parent-data');

    if (!parentElement) {
        //todo log
        console.warn(`[${this.tagName}] Parent component has no data, thought it can be normally.`);
        return;//if has no parent element attr means no attr 'el' or startsWith 'el:'
    }

    let parent = this.closest(parentElement);
    console.log('parent: ', parent);
    console.log('this.attributes: ', this.attributes);
    for (const attr of this.attributes) {
    console.log('attr ------ ', attr);
        //single or multiple props 'el' or any other, but with attribute starting with 'el:'
        if (attr.name.startsWith('prop:')) {
            const key = attr.name.slice(5);
            console.log('key: ', key);
            const dynamicData = resolveDataPath(parent.data, attr.value);
            console.log('attr.value: ', attr.value);
            console.log('dynamicData: ', dynamicData);


            if (dynamicData !== undefined) {
                this.data[key] = this.proxy(dynamicData || {});
                //add found keys to dynamicKeys
                // this.dynamicKeys.push(key);
            } else {
                console.warn(`[${this.tagName}] Failed to resolve prop "${key}" from path "${attr.value}"`);
            }
        }
        //todo uncomment on prod
        // el.removeAttribute('parent-data');
        // el.removeAttribute(attr.name);
    }
}

