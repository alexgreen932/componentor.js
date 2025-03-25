import { updateNestedProperty } from './functions.js';
export default function processEvents(str = null, alt = null) {

    // console.log('this.dynamicKeys: ', this.dynamicKeys);

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

        // console.log('eventName: ', eventName);
        // console.log('preventDefault: ', preventDefault);
        //event has extra properties
        if (eventName.match(/\.prevent/i)) {
            preventDefault = true;
            eventName = eventName.replace('.prevent', '');
        }
        // console.log('eventName: ', eventName);
        // console.log('preventDefault: ', preventDefault);

        //commented on dev
        // item.removeAttribute('data-event');
        // item.removeAttribute('data-prop');
        // item.removeAttribute('data-newvalue');
        // item.removeAttribute('data-method');
        // item.removeAttribute('data-args');

        // console.log('item: ', item);
        item.addEventListener(eventName, (event) => {
            if (preventDefault) {
                event.preventDefault(); // Correctly call the method
            }
            // console.log('event: ', event);
            //if change props
            if (prop) {
                let checkedValue;
                // console.log('checkedValue: ', checkedValue);
                checkedValue = this.getDynamicData(value);
                updateNestedProperty(this, prop, checkedValue);
            }
            //if method
            if (method) {
                if (typeof this[method] === 'function') {
                    // console.log('processedArgs: ', processedArgs);
                    // this[method](...processedArgs); // old with array syntax
                    this[method](args); // Execute function with arguments //new with string
                }
            }

        });
    });
    return doc.body.innerHTML;
}