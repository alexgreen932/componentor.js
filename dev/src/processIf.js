import { getMultiValue } from './functions.js';

export default function processIf(tpl, alt = null) {
    // console.log('Processing IF');
    const parser = new DOMParser();
    const doc = parser.parseFromString(tpl, 'text/html');
    const items = doc.querySelectorAll('[j-if]');
    // console.log('items: ', items);

    // console.log('---this--- ', this);
    if (items.length === 0) return tpl;//for outside j-for used in render method

    items.forEach(item => {
        const str = item.getAttribute('j-if');
        var con, val;
        if ( str.match(/==/i) || str.match(/!==/i) ) {
            var [con, val] = str.split('==');
            con = this.getDynamicData(con.replace('!', '').trim());//remove '!' if '!=='
            val = this.getDynamicData(val.trim());
            // console.log('con: ', con);
            // console.log('val: ', val);
            // console.log('match-----', item);
        } else {        
            con = this.getDynamicData(str.trim()); 
        }

        
        //todo compare ><
        //processing        
        if(str.match(/==/i)){//display if meet condition
            if (con != val) {
                item.remove();
            }
        }else if(str.match(/!==/i)){//display if doesn't meet condition
            if (con === val) {
                item.remove();
            }
        }else{//display condition exist and true
            if (!con) {               
                item.remove();
            }
        }

        //comment on dev / uncomment on prod
        item.removeAttribute('j-if');
    });

    return doc.body.innerHTML;
}