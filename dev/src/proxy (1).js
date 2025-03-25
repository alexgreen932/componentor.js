// proxy.js
const handler = {
    get: function (target, property) {
        return target[property];
    },
    set: function (target, property, value) {
        target[property] = value;
        console.log(`Log 0: Component [${target.__component.tagName}]`);

        if (target.__component && target.__component.r) {
            target.__component.render();
            console.log(`Log 1: Component [${target.__component.tagName}] rerendered because property "${property}" was changed to "${value}"`);
            console.log(`Log 3: [${target.__component.tagName}] Reactive = `, target.__component.r);
        }

        // Emit a custom event to notify all components that data has changed
        const event = new CustomEvent('data-updated', {
            detail: { key: property, value },
            bubbles: true, // Allow it to be caught by other components
        });
        document.dispatchEvent(event);

        return true;
    }
};

export function proxy(data, component) {
    data.__component = component; // Attach component reference
    return new Proxy(data, handler);
}