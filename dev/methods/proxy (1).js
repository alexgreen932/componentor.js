
export default function proxy(data) {
    const component = this;
    return new Proxy(data, {
        get(target, property) {
            return target[property];
        },
        set(target, property, value) {
            target[property] = value;
            const event = new Event('data-updated', { bubbles: true });
            component.dispatchEvent(event); // dispatch from the component

            // console.log(`%c [proxy] property "${property}" changed -> "${value}"`,'color: green'); //no log
            return true;
        }
    });
}


