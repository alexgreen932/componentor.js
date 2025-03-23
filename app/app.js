
// import { el } from './el.js';

const data = {
    title: 'Componentor.js',
    description: 'My Start App Example',
    menu: [
        {title: 'Home', val:'home'},
        {title: 'About', val:'about'},
        {title: 'Contact', val:'contact'},
    ],
};

setInterval(() => {
    // console.log('Log 42: check root data ', data.current);
}, 2000);

//root component
app.com({
    name: 'my-app',
    data: {
        title: 'Componentor.js',
        description: 'My Start App Example',
        menu: [
            {title: 'Home', val:'home'},
            {title: 'About', val:'about'},
            {title: 'Contact', val:'contact'},
        ],
    },
    tpl() {
        return `
            <div class="w-container-c jc-c ai-c p-1 fg-1">
                <i class="fa-solid fa-puzzle-piece"></i>
                <h1>{{data.title}}</h1>
                <div>{{data.description}}</div>
                <my-menu el="data.menu"></my-menu>
            </div>
        `;
    },

    mount() {
        console.log('this.data.current on loading -- ', this.data);
    }
});

//child component
app.com({
    name: 'my-menu',
    tpl() {
        return `
            <ul class="p-1 g-1">
                <li j-for="e in el.menu"><a href="{{e.slug}}">{{e.title}}</a></li>
            </ul>
        `;
    },
    mount(){
        console.log('e --', this.el);        
    }
});

app.com({
    name: 'to-do',
    tpl() {
        return `
            <div class="w-container p-1 bs-2">
            <div class="but-blue" @click="func()">test</div>
            </div>
        `;
    },
    methods:{
        func(){
            alert('test');
        },
    },
    mount() {
        // console.log('this.data.current on loading -- ', this.el);
    }
});


// document.body.innerHTML = `<my-app></my-app>`;