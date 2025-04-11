import { com } from './com.js';

// Expose the app globally (default debug is off here)
(function (global) {
  global.app = {
    com,
  };
})(window);
