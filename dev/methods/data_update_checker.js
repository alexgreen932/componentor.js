import { isStaticOrDynamic } from './help-functions.js';

/**
 * Checks if a value at the given path has changed, and rerenders once if needed
 * @param {*} valueOnRender - Value when the template rendered
 * @param {string} path - Path to track (e.g. "el.cls", "title", "app[0]")
 */
export default function data_update_checker(valueOnRender, path) {
  const compName = this.tagName.toLowerCase();

  

  document.addEventListener('data-updated', () => {
    if (!this.j_isNotRerendered || this.j_isRendering) return;

    let checkedValue = isStaticOrDynamic(this, path);

    // Normalize both values for comparison
    const rendered = JSON.stringify(valueOnRender);
    const current = JSON.stringify(checkedValue);

    // this.j_deb('com-for', [ [rendered, 'on render'], [current, 'path'] ]);

    if (rendered !== current) {
      this.j_isRendering = true;
      this.j_isNotRerendered = false;
      // this.log('Re_render', `Component re-rendered because value of "${path}" changed.`);

      this.render();

      // reset flag after short delay
      setTimeout(() => {
        this.j_isNotRerendered = true;
        this.j_isRendering = false;
      }, 100);
    }
  });
}
