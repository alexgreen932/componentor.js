import { handleAt, handleProp, handleGrid, handleHtml } from './handlers/attrHandlers.js';
import handleColon from './handlers/handleColon.js';
import { isStaticOrDynamic } from './help-functions.js';

// Setup handlers
const handlers = {
    'prop:': handleProp, // For prop:
    'p:': handleProp, // For prop:
    '#': handleProp,    // For grid-like things (if you use #:)
    ':': handleColon,    // For dynamic attribute binding
    'j-html': handleHtml,// For inserting HTML
    '@': handleAt,       // For event listeners
};

/**
 * Find all elements with attributes starting with known prefixes
 * @param {Array} prefixes 
 * @param {String} str 
 * @param {String} type 
 * @returns {Object}
 */
function getElementsByAttributePrefix(prefixes, str, type = '*') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll(type);
    const matchedElements = [];

    elements.forEach(el => {
        for (const attr of el.attributes) {
            if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
                matchedElements.push(el);
                break; // Only need to add each element once
            }
        }
    });

    return { doc, matchedElements };
}

/**
 * Process all special attributes in the template
 * @param {String} tpl 
 * @returns {String}
 */
export default function doAttr(tpl) {
    const { doc, matchedElements } = getElementsByAttributePrefix(['prop:', ':', '@', 'j-html', 'p:', '#'], tpl);

    matchedElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            const value = attr.value.trim();
            for (const prefix in handlers) {
                if (attr.name.startsWith(prefix)) {

                    //re rendering checker for all, it checks if attr.value changeg
                    this.data_update_checker(isStaticOrDynamic(this, attr.value), attr.value);

                    handlers[prefix](el, attr, value, this); // 'this' = component context
                    break;
                }
            }
        });
    });

    return doc.body.innerHTML;
}
