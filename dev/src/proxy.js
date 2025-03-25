// proxy.js
const handler = {
    get: function (target, property) {
        // console.log(`Getting property ${property}`);
        return target[property];
    },
    set: function (target, property, value) {
        console.log('event created');
        console.log(`Setting property ${property} to ${value}`);
        target[property] = value;
        let event = new Event("data-updated", { bubbles: true });
        document.dispatchEvent(event);
        return true;
    }
};

export function proxy(data, component = null) {
    data.__component = component; // Attach component reference //todo
    return new Proxy(data, handler);
}