import { com } from './com.js';
import { dev } from './tools/dev.js';
import { devConsole } from './tools/devConsole.js';

/**
 * Logs a render update for a component.
 * It updates the render count and records the last render time.
 */
function logComponentRender(name, renderTime) {
  // Find the component in the debug log and update render count
  let comp = app.components.find(c => c.name.toUpperCase() === name.toUpperCase());
  if (comp) {
    comp.renders = (comp.renders || 0) + 1;
    comp.lastRenderTime = renderTime;
  }
}


// Expose the app globally (default debug is off here)
(function (global) {
  global.app = {
    com,
    debug: false,//todo rm
    //for development, debugging
    components: [],
    errors: [],
    warnings: [],
    inspectComponent(componentInstance) {
      alert(`Inspecting component: ${componentInstance.tagName}\nData: ${JSON.stringify(componentInstance.args.data, null, 2)}`);
    },
    dev,
    devConsole,
  };
})(window);





