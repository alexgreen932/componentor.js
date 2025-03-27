import { handleEl, handleColon, handleAt } from './handlers/attrHandlers.js';
// import handleAt  from './handlers/handleAt.js';//todo rm file if not used

const handlers = {
	'el': handleEl,
	'el:': handleEl, // in case you also use el:
	':': handleColon,
	'@': handleAt,
};

function getElementsByAttributePrefix(prefixes, str, type = '*') {
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, 'text/html');
	const elements = doc.querySelectorAll(type);
	const matchedElements = [];

	elements.forEach(el => {
		for (const attr of el.attributes) {
			if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
				matchedElements.push(el);
				break;
			}
		}
	});
	return { doc, matchedElements };
}

export default function processAttr(tpl) {
	const { doc, matchedElements } = getElementsByAttributePrefix(['el', ':', '@'], tpl);

	matchedElements.forEach(el => {
		Array.from(el.attributes).forEach(attr => {
			const value = attr.value.trim();
			for (const prefix in handlers) {
				if (attr.name.startsWith(prefix)) {
					handlers[prefix](el, attr, value, this); // pass context
					el.removeAttribute(attr.name);
					break;
				}
			}
		});
	});

	return doc.body.innerHTML;
}
