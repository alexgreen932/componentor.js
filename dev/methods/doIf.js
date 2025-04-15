import { getMultiValue, cB } from './help-functions.js'

//todo rm alt
export default function doIf(tpl, alt = null) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-if]');

    if (items.length === 0) return tpl;

    items.forEach(item => {
        const str = item.getAttribute('j-if');
        let condition, value;

        if (str.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/)) {
            condition = this.executeMethod(str); 
            // console.log(`str "${str}" matches and returns →`, condition, typeof condition);
        } else if (str.includes('==') || str.includes('!==')) {
            [condition, value] = str.split('==');
            condition = this.getDynamicData(condition.replace('!', '').trim());
            value = this.getDynamicData(value.trim());
        } else {
            condition = this.getDynamicData(str.trim()); 
        }

        // Remove based on result
        if (str.includes('==')) {
            if (condition != value) item.remove();
        } else if (str.includes('!==')) {
            if (condition === value) item.remove();
        } else {
            if (!condition) item.remove();
        }

        item.removeAttribute('j-if'); // cleanup
    });

    return doc.body.innerHTML;
}