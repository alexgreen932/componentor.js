import { resolveDataPath, removeQuotes, isStaticOrDynamic } from './help-functions.js';

/**
 * Processes j-if conditions in the template HTML string.
 * Removes elements based on the evaluation result of their condition.
 * 
 * @param {string} tpl - The HTML string of the template.
 * @param {string|null} alt - Optional fallback (currently unused).
 * @returns {string} - The modified HTML with j-if conditions applied.
 */
export default function doIf(tpl, alt = null) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-if]');

    if (items.length === 0) return tpl;

    items.forEach(item => {
        const raw = item.getAttribute('j-if').trim();
        let condition, value;

        // 1. If it's a method call like myMethod(123), execute it directly
        if (raw.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/)) {
            condition = this.executeMethod(raw);

        // 2. If it's a comparison expression
        } else if (raw.includes('==') || raw.includes('!==')) {
            // Split into left-hand side and right-hand side
            const [left, right] = raw.split(/==|!==/);
            const operator = raw.includes('!==') ? '!==' : '==';

            const leftPath = left.replace('!', '').trim();
            const rightValue = right.trim();

            // Resolve both left and right sides properly
            condition = resolveDataPath(this, leftPath);
            value = isStaticOrDynamic(this, rightValue);

            // Debugging logs
            // console.log('j-if expression:', raw);
            // console.log('→ condition resolved:', condition);
            // console.log('→ value resolved:', value);

            // Apply condition based on the operator
            if (operator === '==') {
                if (condition != value) item.remove();
            } else if (operator === '!==') {
                if (condition == value) item.remove();
            }

        // 3. Simple condition (e.g. j-if="isVisible")
        } else {
            condition = resolveDataPath(this, raw);
            if (!condition) item.remove();
        }

        item.removeAttribute('j-if'); // Clean up
    });

    return doc.body.innerHTML;
}
