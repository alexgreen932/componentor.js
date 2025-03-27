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
        //new
        let elEvent = item.getAttribute('data-event');
        let eventData = item.getAttribute('event-data');
        //commented on dev
        // item.removeAttribute('data-event');
        // item.removeAttribute('event-data');

        //get extra params
        if (elEvent.match(/\.prevent/i)) {
            preventDefault = true;
            elEvent = elEvent.replace('.prevent', '');
        }

        item.addEventListener(elEvent, (event) => {

            //execute preventDefault if true
            if (preventDefault) {
                event.preventDefault(); // Correctly call the method
            }
            
            if (eventData.includes(';')) {
                //if multi value ie a few methods or data changes divided by ';'
                let multi_events = eventData.split(';').map(s => s.trim());
                console.log('multi_events: ', multi_events);
                multi_events.forEach(multi_event => {
                    this.eventHandler(multi_event);
                });

            } else {
                //single method or data change
                this.eventHandler(eventData);
            }

        });
    });
    return doc.body.innerHTML;
}