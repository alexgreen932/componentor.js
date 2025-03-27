import { getMultiValue } from './functions.js';

export default function processIf(tpl, alt = null) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-if]');
    
    

    if (items.length === 0) return tpl;//for outside j-for used in render method

    items.forEach(item => {
        const str = item.getAttribute('j-if');
        var condition, value;

        //if method, usually for returning true or false, if multiple conditions etc
        if (str.match(/^([a-zA-Z0-9_]+)\((.*?)\)$/)) {
            condition = this.executeMethod(str); 
            console.log(`str "${str}" matches and returns "${condition}"`);
        }

        if ( str.match(/==/i) || str.match(/!==/i) ) {
            var [condition, value] = str.split('==');
            condition = this.getDynamicData(condition.replace('!', '').trim());//remove '!' if '!=='
            value = this.getDynamicData(value.trim());
        } else {        
            condition = this.getDynamicData(str.trim()); 
        }

        
        //todo compare ><
        //processing        
        if(str.match(/==/i)){//display if meet conditiondition
            if (condition != value) {
                item.remove();
            }
        }else if(str.match(/!==/i)){//display if doesn't meet conditiondition
            if (condition === value) {
                item.remove();
            }
        }else{//display conditiondition exist and true
            if (!condition) {               
                item.remove();
            }
        }

        //comment on dev / uncomment on prod
        item.removeAttribute('j-if');
    });

    return doc.body.innerHTML;
}