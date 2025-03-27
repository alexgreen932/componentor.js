import { updateNestedProperty } from './functions.js';

export default function eventHandler(eventData) {
// console.log('eventData: ', eventData);

    if (eventData.includes('=')) {
        //changing property value
        let [prop, new_value] = eventData.split('=').map(s => s.trim());
        new_value = this.getDynamicData(new_value);
        updateNestedProperty(this, prop, new_value);
    } else {
        //execute function
        this.executeMethod(eventData);

    }

}
