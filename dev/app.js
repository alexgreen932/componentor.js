const data = {
    start_page: 'getting-started',
    current_page: null,
    current_page: 'events',
    current_page_title: null,
    current_page_content: null,
    menu_side: null,
    menu:[
        {title:'Events', slug:'events'},
        {title:'Components', slug:'components'},
    ]
};

setInterval(() => {
    // console.log('Log 42 ', data.cls);
    // console.log('Log 42 ', data.post.cls);
    // console.log('Log 43 ', data);
}, 2000);

function globFunc(){
    alert("I'm global function")
}
app.globFunc = globFunc;

com({
    name: 'j-menu',
    data: data,
    r: false,
    tpl() {
        return html`
            <ul class="fd-c g-05 p-1">
                <li j-for="menu">
                    <a href="[e.slug]" class="j-click {{isActive('[e.slug]')}}" @click.prevent.app="app.globFunc()">[e.title]</a>
                </li>
                <div>[test]</div>
                <input type="text" value="{{current_page_title}}" />
            </ul>
        `
    },
    methods: {
        isActive(slug){
        console.log('slug: ', slug);
            if (slug === this.current_page) {
                return 'isActive';
            }else{
                return '';
            }
        },
        getPage(slug, title) {
        console.log('slug: ', slug);
        console.log('title: ', title);
            const state = { path: slug };
            history.pushState(state, title, slug);
            console.log('this.current_pag before ', this.current_page);
            this.current_page = slug;
            console.log('this.current_pag after ', this.current_page);
            // this.e;
        }
    },
    mount() {
        // app.globFunc();
        // console.log('this ---------------- ', this);
    },
})

//----------------------------------
com({
    name: 'my-post',
    tpl() {
        return html`
            <div class="{{el.cls}}">
                <h1>{{el.title}}</h1>
                <div>{{el.content}}</div>
            </div>
        `
    },
})

com({
    name: 'my-form',
    data:{
        title: 'Form title from current data',
    },
    r: false,
    tpl() {
        return html`
            <div class="fd-c g-1">
                <hr>
                <h2>{{title}}</h2>
                <input type="text" j-model="el.title"/>
                <textarea j-model="el.content"></textarea>
                <select j-model="el.cls"> 
                    <option value="tx-black">black</option>
                    <option value="tx-blue">blue</option>
                    <option value="tx-red">red</option>
                </select> 
            </div>
        `
    },
    mount() {
        console.log('this.el ---------------- ', this.el);
        console.log('this.el.title ---------------- ', this.el.title);
    },
})

app.com({
    name: 'form-standalone',
    data: data,
    r: false,
    tpl() {
        return `
            <div class="fd-c g-1">
                <hr>
                <input type="text" j-model="post.title"/>{{}}</input> 
                <textarea j-model="post.content"></textarea>
                <select j-model="post.cls"> 
                    <option value="tx-black">black</option>
                    <option value="tx-blue">blue</option>
                    <option value="tx-red">red</option>
                </select> 
            </div>
        `
    },
    mount() {
        // console.log('this.data ---------------- ', this.data);
    },
})


