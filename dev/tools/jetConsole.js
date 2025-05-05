// import { app } from '../jet-dev.js';
import './develop-console.js';

export default function jetConsole(){
    app.dev = true;
    
    document.addEventListener("DOMContentLoaded", (event) => {
        //DOM full ready only then load console
        // console.log("DOM ready ---", app.components);
        document.body.insertAdjacentHTML("beforeend", '<develop-console></develop-console>');
      });
}