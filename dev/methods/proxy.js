
export default function proxy(data) {
    const component = this;
    return new Proxy(data, {
        get(target, key) {
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;// Trigger the updated hook

            if (typeof component.updated === 'function') {
                component.updated(key, value);
                //TODO add push  to devTools for watching
            }
            const event = new Event('data-updated', { bubbles: true });
            //TODO add push  to devTools for watching
            console.log('created event -------- ', event);
            component.dispatchEvent(event); // dispatch from the component

            // console.log(`%c [proxy] key "${key}" changed -> "${value}"`,'color: green'); //no log
            return true;
        }
    });
}


