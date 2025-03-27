




/**
 * object is element object, path is multi key like 'data.posts'
 * @param {*} obj 
 * @param {*} path 
 * @returns 
 */
function resolveDataPath(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}
export { resolveDataPath };

/**
 * This function takes a string with HTML and a list of attribute prefixes,
 * and returns an object containing the parsed HTML and the matched elements.
 * @param {*} prefixes 
 * @param {*} str 
 * @param {*} type 
 * @returns 
*/

export function getElementsByAttributePrefix(prefixes, str, type = '*') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    const elements = doc.querySelectorAll(type);
    const matchedElements = [];

    elements.forEach(el => {
        for (const attr of el.attributes) {
            if (prefixes.some(prefix => attr.name.startsWith(prefix))) {
                matchedElements.push(el);
                break; // Stop after the first matching attribute
            }
        }
    });

    return { doc, matchedElements };
}



/**
 * Updates a nested property in an object based on a dot-notated key path.
 * If the path doesn't exist, it creates the necessary nested objects.
 *
 * @param {Object} obj - The object to update.
 * @param {string} keyPath - A dot-notated string representing the path to the property.
 * @param {*} newValue - The new value to set for the specified property.
 * @returns {void} This function doesn't return a value; it modifies the input object.
 */
export function updateNestedProperty(obj, keyPath, newValue) {
    const keys = keyPath.split('.'); // Split the key path into an array of keys
    let current = obj;

    // Traverse the object to the second-to-last key
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {}; // Create a new object if the key doesn't exist
        }
        current = current[key];
    }

    // Update the last key with the new value
    current[keys[keys.length - 1]] = newValue;
}


/**
 * Checks if a value is static or dynamic.
 * Static values are either enclosed in single quotes or numeric.
 * Dynamic values are resolved using the provided object.
 * @param {*} obj 
 * @param {*} value 
 * @returns 
 */
export function isStaticOrDynamic(obj, value) {
    value = value.trim();
    if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
        return value;
    } else if(!isNaN(value)){//if number
        return value;
    } else {
        return resolveDataPath(obj, value);
    }
}

/**
 * 
 * @param {*} value //key or value
 * @param {*} component // this
 * @param {*} alt //alt object eg iterated contend object
 * @returns 
 */
export function getMultiValue(value, component, alt) {
    // console.log('getMultiValue called');
    value = value.trim();

    // Check if it's a static string (wrapped in single quotes)
    if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1); // Remove the quotes and return the string
        // console.log('single quotes');
    }

    // Check if it's a number
    if (!isNaN(value)) {
        return Number(value);
    }

    // If it starts with "method.", assume it's a method call
    if (value.startsWith("method.")) {
        let methodName = value.slice(7); // Remove "method."
        if (typeof component[methodName] === "function") {
            return component[methodName](); // Call the method
        }
    }

    // console.log('value: ', value);
    // console.log('alt: ', alt);
    // console.log('alt.key: ', alt.key);
    // If it's an iterated object property (alt.key exists)
    //todo check seems not used, then rm
    if (alt && value.startsWith(alt.key + ".")) {

        let keyPath = value.slice(alt.key.length + 1); //todo // Remove 'e.' prefix//wrong as it can be not only 'e. but 'item.' etc
        return resolveDataPath(alt.obj, keyPath); // Get from iterated object
    }

    // console.log('component: ', component);
    // console.log('--------value: ', value);
    // Otherwise, try resolving it from the component (element's data)
    return resolveDataPath(component, value);
}







