export default function proxy(data) {
    const component = this;
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
            if (typeof app?.pushLog === 'function') {
              app.pushLog('prop_missed', logMsg);
            }
            return '';
          }
          return value;
        },
        set(obj, key, value) {
          if (obj[key] === value) return true;
          obj[key] = value;
  
          const fullPath = `${path}${key}`;
          // console.log(`[proxy] "${fullPath}" set to "${value}"`);
          if (typeof app?.pushLog === 'function') {
            app.pushLog('proxy', `"${fullPath}" set to "${value}"`);
          }
  
          if (typeof component.updated === 'function') {
            component.updated(fullPath, value);
          }
          // console.log(`[proxy] dispatching "data-updated" for "${fullPath}"`);
  
          const event = new Event('data-updated', { bubbles: true });
          if (app?.debug) {
            // console.log(`[proxy] dispatching "data-updated" for "${fullPath}"`);
          }
          component.dispatchEvent(event);
  
          return true;
        }
      };
  
      const proxy = new Proxy(target, handler);
      seen.set(target, proxy);
      return proxy;
    }
  
    return createProxy(data);
  }
  