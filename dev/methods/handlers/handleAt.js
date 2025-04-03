// import { resolveDataPath } from './help-functions.js';

export default function handleAt(el, attr, value, context) {
	const event = attr.name.slice(1);

	if (value.includes('=')) {
		const [prop, val] = value.split('=').map(s => s.trim());
		el.setAttribute('data-event', event);
		el.setAttribute('data-prop', prop);
		el.setAttribute('data-newvalue', val);
	} else {
        //process function call
		const match = value.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/);
		if (match) {
			const methodName = match[1];
			let args = null;
			if (match[2]) {
				args = match[2];
                el.setAttribute('data-args', args);//set data-args only if it has
			}
            //old way
			// if (match[2] && match[2].includes(',')) {
			// 	args = match[2].split(',').map(arg => context.getDynamicData(arg)).join(', ');
            //     console.log('multi args ', args);
			// } else if (match[2]) {
			// 	args = context.getDynamicData(match[2]);
            //     console.log('single arg ', args);
			// }
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', methodName);
		} else {
			el.setAttribute('data-event', event);
			el.setAttribute('data-method', value);
		}
	}

	context.doEvents();
}
