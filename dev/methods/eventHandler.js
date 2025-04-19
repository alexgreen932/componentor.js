import { updateNestedProperty } from './help-functions.js';

//execute method or changes data on events
export default function eventHandler(eventData) {
// console.log('eventData: ', eventData);

    if (eventData.includes('=')) {
        //changing property value
        let [prop, new_value] = eventData.split('=').map(s => s.trim());
        new_value = resolveDataPath(this, new_value);
        updateNestedProperty(this, prop, new_value);
    } else {
        //execute function
        this.executeMethod(eventData);

    }

}
