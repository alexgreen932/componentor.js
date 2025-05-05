import { com } from './com.js';
import jetConsole from './tools/jetConsole.js'
// import fly from './fly.js';//todo
import initializeAnimation from './extras/animate.js';

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
    // defaultEvent = '',
    reRender: true,
    com,
    components: [],
    dev: false,
    pushLog,
    watchers: {
      rerender: true,
      data_changed: true,//??
      proxy: true,
      rerender: true,
      detect_function_error: true,
      error: true,
      Loading: true,
      Loaded: true,
    },
    logs: [],
    // inspectComponent,
    
  };
})(window);


//set main functions as global
window.com = com;
console.log('app components before console');
window.jetConsole = jetConsole;


// console.log('watchers type proxy ', app.watchers.proxy);//correct


function pushLog(type, message) {

  if (app.watchers[type]) {
    // console.log(`watcher "${type}" is enabled ---------`);
    app.logs.push(`<span class="log-event">[${type}]</span> <span class="log-message">${message}</span>`);
      // console.log('logs --- ',app.logs);
    if (app.devtoolsEnabled?.refreshDevConsole) {
      app.dev.refreshDevConsole();    
    }
  }
}

//Development tools in development yet
app.pushLog = pushLog;//todo ?? rm
//todo think to remove on prod
window.devtools = () => app.devConsole();//todo ?? rm


//This function reconstructs the string and returns it untouched.
//return html uses for vs plugin prettier only
window.html = (strings, ...values) =>
  strings.reduce((out, str, i) => out + str + (values[i] ?? ''), '');

//animation component 
//class based
initializeAnimation();
//new component
//fly(); //todo








