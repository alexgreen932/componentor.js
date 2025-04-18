import { com } from './com.js';
import { dev } from './tools/dev.js';
import { devConsole } from './tools/devConsole.js';
import inspectComponent from './tools/inspectComponent.js';
import console from './tools/console.js';

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
    components: [],
    dev,
    devConsole,
    console,
    pushLog,
    watchers: {
      rerender: true,
      data_changed: true,
      proxy: true,
      rerender: true,
      detect_function_error: true,
    },
    logs: [],
    inspectComponent,
    
  };
})(window);


// console.log('watchers type proxy ', app.watchers.proxy);//correct


function pushLog(type, message) {
// console.log('type: ', type);//current is proxy
// console.log('watchers type inside of pushLog ', app.watchers[type]);//shows undefined
  // console.log('push');
  if (app.watchers[type]) {
    // console.log(`watcher "${type}" is enabled ---------`);
    app.logs.push(`<span class="log-event">[${type}]</span> <span class="log-message">${message}</span>`);
      // console.log('logs --- ',app.logs);
    if (app.devtoolsEnabled?.refreshDevConsole) {
      app.dev.refreshDevConsole();    
    }
  }
}

app.pushLog = pushLog;
//todo think to remove on prod
window.devtools = () => app.devConsole();

// app.components
// console.log('app.components: ', app.components);






