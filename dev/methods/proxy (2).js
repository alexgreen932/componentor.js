export default function proxy(obj = {}, fallback = false) {
	return new Proxy(obj, {
		get: (target, prop) => {
			if (prop in target) return target[prop];
			if (window.app?.dev) {
				console.warn(`[Proxy] Missing property "${prop}"`, target);
			}
			return fallback;
		},
		set: (target, prop, value) => {
			target[prop] = value;
			this.e(); // reactive rerender
            //creates data-updated signal only, rest aded manually for now
            //todo improve
            // const event = new Event('data-updated', { bubbles: true });
            // this.dispatchEvent(event);
			// return true;
		}
	});
}



