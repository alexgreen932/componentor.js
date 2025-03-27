import { com } from './componentor.js';

const data = {
    items: [
        { content: 'dolor sit amet', a:42, b:50 },
        { content: 'Consectetur adipiscing elit', a:42, b:50 },
        { content: 'Ut enim ad minim veniam', a:42, b:50 },
    ],
    a:42, 
    b:50,
    c: 'prop c value',
    d: true,
    d: false,
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
                <h1 j-if="data.d">App</h1>
                <h2 j-if="show(data.d)">Description</h2>
                <span class="j-click b-red" @click="mathFunc(data.a, data.b)">Works fine if single</span>
                <span class="j-click b-blue" @click="data.a=data.c; data.b=data.c; singleArg(data.c); mathFunc(data.a, data.b)">TEST</span>
                <hr>
                <h3>DATA A - {{data.a}}</h3>
                <h3>DATA B - {{data.b}}</h3>
            </div>     
        `;
    },
    methods: {
        show(){
            if(this.data.d) return true;
        },
        mathFunc(a,b){
            let c = parseInt(a) + parseInt(b);
            // alert(`arg 1 - ${a},arg2 - ${b}`);
            alert(c);
        },
        fnSimple(){
            alert('clicked');
        },
        singleArg(v){
            alert(v);
        },
    },
    mount(){
        console.log('this.data.current on loading -- ', this.data);
    }
});
