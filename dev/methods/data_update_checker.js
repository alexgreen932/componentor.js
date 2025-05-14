import { resolveDynamicIndex, isStaticOrDynamic } from './help-functions.js';

/**
 * Checks if a value at the given path has changed, and rerenders once if needed
 * @param {*} valueOnRender - Value when the template rendered
 * @param {string} path - Path to track
 */
export default function data_update_checker(valueOnRender, path) {

  //dev only - check only sertain components
  let comp = 'com-html';
  let current_com = this.tagName.toLowerCase();
  console.log('current_com: ', current_com);
  if (current_com === comp) {
    console.log('valueOnRender--------- ', valueOnRender);
    console.log('path ---------- ', path);
    console.log('processedPath ---------- ', isStaticOrDynamic(this, path) );
  }




  document.addEventListener('data-updated', () => {
    // prevent rerender if flag not allowed
    if (!this.j_isNotRerendered || this.j_isRendering) return;

    // let checkedValue = resolveDynamicIndex(path, this);
    let checkedValue = isStaticOrDynamic(this, path);

    //stringified for jfor as it uses array
    valueOnRender = JSON.stringify(valueOnRender);
    checkedValue = JSON.stringify(checkedValue);

    if (valueOnRender !== checkedValue) {
      this.j_isRendering = true;             // avoid infinite loops
      this.j_isNotRerendered = false;        // mark rerendered
      this.log('Re_render', `Component Re Rendered of any property had been changed`);

      this.render();

      // delay resetting so next update can rerender again
      setTimeout(() => {
        this.j_isNotRerendered = true;
        this.j_isRendering = false;
      }, 100);
    }
  });
}







