import { handleEl, handleColon, handleAt, handleProp } from './handlers/attrHandlers.js';

//todo re el if used prop
const handlers = {
	'el': handleEl,
	'el:': handleEl, // in case you also use el:
	'prop:': handleProp, // in case you also use prop:
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

export default function doAttr(tpl) {
	const { doc, matchedElements } = getElementsByAttributePrefix(['el', 'prop:', ':', '@'], tpl);

	matchedElements.forEach(el => {
		Array.from(el.attributes).forEach(attr => {
			const value = attr.value.trim();
			for (const prefix in handlers) {
				if (attr.name.startsWith(prefix)) {
					handlers[prefix](el, attr, value, this); // pass context
					// el.removeAttribute(attr.name);
					break;
				}
			}
		});
	});

	return doc.body.innerHTML;
}
