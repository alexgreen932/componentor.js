import { en } from './en.js';
import { ru } from './ru.js';

const languages = { en, ru };

export default function _(v) {
    let langCode = navigator.language.slice(0, 2); // get 'en' from 'en-US'
    let currentLang = languages[langCode] || en;

    
    if (currentLang[v]) {
        return currentLang[v];
    } else if (en[v]) {
        return en[v];
    } else {
        console.error(`CREATE - "${v}"`);
        return v;
    }
}

// test
