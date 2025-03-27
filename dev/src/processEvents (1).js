import { updateNestedProperty } from './functions.js';

function getCleanValue(value) {
    let cleanedValue = null;
    //single quoted args
    if (value.startsWith('"')) {
        cleanedValue = value.replaceAll('"', '');
    } else {
        cleanedValue = value;
    }
    //todo for multiple, boolean etc

    return cleanedValue;
}

export default function processEvents(str = null, alt = null) {


    const parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');

    //note this works only in render
    this.querySelectorAll('[data-event]').forEach(item => {
        let preventDefault = false;
        let eventName = item.getAttribute('data-event');
        let prop = item.getAttribute('data-prop');
        let value = item.getAttribute('data-newvalue');
        let method = item.getAttribute('data-method');
        // let args = JSON.parse(item.getAttribute('data-args') || '[]');
        let args = item.getAttribute('data-args') || null;


        //event has extra properties
        if (eventName.match(/\.prevent/i)) {
            preventDefault = true;
            eventName = eventName.replace('.prevent', '');
        }

        //commented on dev
        // item.removeAttribute('data-event');
        // item.removeAttribute('data-prop');
        // item.removeAttribute('data-newvalue');
        // item.removeAttribute('data-method');
        // item.removeAttribute('data-args');

        item.addEventListener(eventName, (event) => {
            //process args starts only on click, no need to process in vain
            let argArray = [];
            if (args) {
                if (args.includes(',')) {
                    args.split(',').forEach(arg => {
                        arg = arg.trim();
                        let val = this.getDynamicData(arg);
                        argArray.push(val);
                    });

                } else {
                    let val = this.getDynamicData(args);
                    argArray.push(val);

                }
            }
            if (preventDefault) {
                event.preventDefault(); // Correctly call the method
            }
            //if change props
            if (prop) {
                let checkedValue;
                checkedValue = this.getDynamicData(value);
                updateNestedProperty(this, prop, checkedValue);
            }
            //if method
            if (method) {
                if (typeof this[method] === 'function') {
                    // this[method](...processedArgs); // old with array syntax
                    this[method](...argArray); // Execute function with arguments //new with string
                }
            }

        });
    });
    return doc.body.innerHTML;
}