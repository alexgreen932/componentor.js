import { resolveDataPath, cE } from './help-functions.js';
//cE is colored console.error - usage cE(errorMassage, component)

export default function doFor(str) {
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


        //NEW WAY----
        let key = 'e', idx = 'i', arr = [];// values by default, not sure arr should be array

        if (forValue.includes(' in ')) {// if used ' in '
            // Split the `j-for` value to extract the key and array
            let [left, right] = forValue.split(' in ').map(s => s.trim());
            key = left;
            arr = right;

            // Check if the key includes an index (e.g., `(e, i)`)
            if (key.startsWith('(') && key.endsWith(')')) {
                [key, idx] = key.slice(1, -1).split(',').map(s => s.trim());
            }
        } else {//if no key, array only
            arr = forValue;
        }
        //check processing
        console.log('key: ', key);
        console.log('idx: ', idx);
        console.log('arr: ', arr);


        // Resolve the array from the data
        let evalArray = resolveDataPath(this, arr);
        console.log('evalArray: ', evalArray);

        // Check if the array is valid
        if (!Array.isArray(evalArray)) {
            cE(`j-for data for value "${arr}" is not iterable, output is "${evalArray}"`,this);
            return; // Skip this element if the array is invalid
        }

        // Map over the array to generate new HTML elements
        let output = evalArray.map((item, index) => {
            let clone = element.cloneNode(true); // Clone the original element
            let html = clone.innerHTML;
            console.log('html: ', html);
            if (html.match(/template/i)) {
                console.log('has template');
            } else {
                console.log('NO template');
            }


            // Replace placeholders like `{{e.title}}` or `{{i}}` with actual values
            html = html.replaceAll(/{{(.*?)}}/g, (match, p1) => {
                // Check if the placeholder starts with the key (e.g., `e.`) or matches the index variable
                if (p1.startsWith(`${key}.`) || p1 === idx) {
                    // console.log('p1: ', p1);
                    // Evaluate the expression within the placeholder
                    let output = new Function(key, idx, `return ${p1}`)(item, index);
                    // console.log('output before ', output);
                    // output = output.replaceAll('"', '');
                    // console.log(`${output} type is ${typeof output}` );
                    return output;
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