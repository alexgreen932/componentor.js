export default function proxy(data) {
  const component = this; // this === component instance
  const seen = new WeakMap();

  function createProxy(target, path = '') {
    if (typeof target !== 'object' || target === null) return target;
    if (seen.has(target)) return seen.get(target);

    const handler = {
      get(obj, key) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return createProxy(value, `${path}${key}.`);
        }
        if (!(key in obj)) {
          const logMsg = `[proxy] missed property "${path}${key}", returning default ""`;
          console.warn(logMsg);
          component.log('prop_missed', logMsg);//todo dev
          return '';
        }
        return value;
      },
      set(obj, key, value) {
        if (obj[key] === value) return true;
        obj[key] = value;

        const fullPath = `${path}${key}`;

        if (typeof component.updated === 'function') {
          component.updated(fullPath, value);
          //todo dev maybe?
        }

        // Dispatch single or multiple events
        //refactored
        const events = Array.isArray(component.j_r) ? component.j_r : [component.j_r];
        events.forEach(ev => {
          const event = new Event(ev, { bubbles: true });
          component.dispatchEvent(event);
          component.log('proxy', `Updated property "${key}" with value "${value}" at event "${ev}"`);
        });

        return true;
      }
    };

    const proxy = new Proxy(target, handler);
    seen.set(target, proxy);
    return proxy;
  }

  return createProxy(data);
}
