export default function proxy(data) {
	const component = this;

	return new Proxy(data, {
		get(target, key) {
			if (key in target) {
				return target[key];
			}

			// Log and return default value if property is missing
			const logMsg = `[proxy] missed property "${key}", returning default ""`;
			console.warn(logMsg);
			if (typeof app?.pushLog === 'function') {
				app.pushLog('prop_missed', logMsg);
			}
			return '';
		},

		set(target, key, value) {
			// Optional: Avoid unnecessary updates
			if (target[key] === value) return true;

			target[key] = value;

			// Debug log
			console.log(`[proxy] "${key}" set to "${value}"`);
			if (typeof app?.pushLog === 'function') {
				app.pushLog('proxy', `"${key}" set to "${value}"`);
			}

			// Optional updated hook
			if (typeof component.updated === 'function') {
				component.updated(key, value);
			}

			// Fire reactive update event
			const event = new Event('data-updated', { bubbles: true });
			if (app?.debug) {
				console.log(`[proxy] dispatching "data-updated" for "${key}"`);
			}
			component.dispatchEvent(event);

			return true;
		}
	});
}
