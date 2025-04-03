import { com } from './componentor.js';
import { cE, cB, cR, cG, cD } from './methods/help-functions.js';

const data = {
    a:42, 
    b:50,
    // c: 'prop c value',
    c: 55,
    // d: true,
    // d: false,
    d: 'test',
    e: false,
};

setInterval(() => {
    // console.log('Log 42: ', data.items);
}, 2000);




com({
    name: 'my-app',
    data: data,
    tpl() {
        return `  
            <div class="w-container-c bs-2 g-1 pv-3">
                <h2 j-if="show(data.d)">Description</h2>
            </div>     
        `;
    },
    methods: {
        show(v){
            if(v ==='test') return true;
            // if(v) return true;
        },
        showWithoutArgs(){
            if(this.data.e) return true;
        },
        mathFunc(a,b){
            let c = a + b;
            alert(c);
        },
        fnSimple(){
            alert('clicked');
        },
        singleArg(v){
            alert(v);
        },
    },
});
