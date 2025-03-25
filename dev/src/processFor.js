import { resolveDataPath } from './functions.js';

export default function processFor(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll('[j-for]');

    elements.forEach(element => {
        // Check if the element has a `j-if` directive
        let hasIf = element.querySelector('[j-if]') !== null;
        // console.log('hasIf------ ', hasIf);

        // Get the value of the `j-for` attribute
        let forValue = element.getAttribute('j-for');
        //Clean up
        element.removeAttribute('j-for');

        // Split the `j-for` value to extract the key and array
        let idx;
        let [key, arr] = forValue.split(' in ').map(s => s.trim());

        // Check if the key includes an index (e.g., `(e, i)`)
        if (key.startsWith('(') && key.endsWith(')')) {
            [key, idx] = key.slice(1, -1).split(',').map(s => s.trim());
        }

        // Resolve the array from the data
        let evalArray = resolveDataPath(this, arr);
        // console.log('evalArray: ', evalArray);

        // Check if the array is valid
        if (!Array.isArray(evalArray)) {
            // console.error(`Component [${this.tagName}] j-for data not iterable: ${evalArray}`);
            console.error(`%c Component [${this.tagName}]: j-for data for value "${arr}" is not iterable, output is "${evalArray}"`, 'background:#0d47a1; color: #fff; padding:3px;');//better error message
            return; // Skip this element if the array is invalid
        }

        // Map over the array to generate new HTML elements
        let output = evalArray.map((item, index) => {
            let clone = element.cloneNode(true); // Clone the original element
            let html = clone.innerHTML;

            // Replace placeholders like `{{e.title}}` or `{{i}}` with actual values
            html = html.replaceAll(/{{(.*?)}}/g, (match, p1) => {
                // Check if the placeholder starts with the key (e.g., `e.`) or matches the index variable
                if (p1.startsWith(`${key}.`) || p1 === idx) {
                // console.log('p1: ', p1);
                    // Evaluate the expression within the placeholder
                    return new Function(key, idx, `return ${p1}`)(item, index);
                } else {
                    // Skip this placeholder, as it is not part of the iteration context
                    return match; // Return the original placeholder

                }
            });

            clone.innerHTML = html; // Update the inner HTML of the cloned element
            return clone.outerHTML; // Return the outer HTML of the cloned element
        }).join('');

        // Replace the original element with the generated HTML
        element.outerHTML = output;

    });

    return doc.body.innerHTML;
}