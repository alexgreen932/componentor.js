import { resolveDataPath } from './help-functions.js'

export default function doLoader(tpl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-load]');

    if (items.length === 0) return tpl;

    items.forEach(item => {
        const conditionPath = item.getAttribute('j-load');
        const conditionValue = resolveDataPath(this, conditionPath);

        const isLoading = conditionValue === false || conditionValue === null || conditionValue === '';
        const defaultLoader = `<div style="opacity:0;transition:opacity 0.4s ease;display:flex;justify-content:center;padding:1rem">Loading...</div>`;
        const loaderHTML = app.loader || defaultLoader;

        item.removeAttribute('j-load'); // cleanup the directive

        if (isLoading) {
            // Replace content with loader
            item.innerHTML = loaderHTML;
            const loaderEl = item.firstElementChild;

            if (loaderEl) {
                // Force reflow so opacity transition works
                void loaderEl.offsetWidth;
                loaderEl.style.opacity = '1';
            }

        } else {
            //todo dev pushlog
            // optional fade-out logic for existing loaders (if needed)
        }
    });

    return doc.body.innerHTML;
}
