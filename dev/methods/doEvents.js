import { updateNestedProperty } from './help-functions.js';

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

//todo rm alt
export default function doEvents(str = null, alt = null) {


    const parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');

    //note this works only in render
    this.querySelectorAll('[data-event]').forEach(item => {
        let preventDefault = false;
        //new
        let elEvent = item.getAttribute('data-event');
        console.log('elEvent: ', elEvent);
        let eventData = item.getAttribute('event-data');
        //commented on dev
        // item.removeAttribute('data-event');
        // item.removeAttribute('event-data');

        //event conditions
        if (elEvent.match(/\.prevent/i)) {
            preventDefault = true;
            elEvent = elEvent.replace('.prevent', '');
        }
        if (elEvent.match(/\.app/i)) {
            console.log('is global APP');
            elEvent = elEvent.replace('.app', '');
        }
        //not sure it's correct way to redo above to
        switch (true) {
            case elEvent.match(/\.prevent/i):
                preventDefault = true;
                elEvent = elEvent.replace('.prevent', '');
                break;
            case elEvent.match(/\.app/i):
                console.log('is global APP in switch');
                break;
            default:
                break;
        }

        //if event has condition .app it should execute not local method ,but global function in current example test function app.globFunc()
        //important note if function has arguments it should be executed too, but arguments can be dynamic so it should be done in executeMethod i think


        console.log('elEvent ----- ', elEvent);

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