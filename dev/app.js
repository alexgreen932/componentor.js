
const data = {
    start_page: 'getting-started',
    current_page: null,
    current_page_title: null,
    current_page_content: null,
    menu_side: null,
};
setInterval(() => {
    console.log('set interval ---- ', data.current_page);
}, 2000);

app.dev.check(data.current_page, 'current page ----');//same as set interval
console.log('---- ', data.current_page);
app.devConsole();
 


//todo refactor, improve and add in func pack
function getApi(url) {
    //create fetch
    let reqPromise = fetch(url);
    // console.log('reqPromise: ', reqPromise);
    async function getData() {
        let response = await (await reqPromise).json();
        // console.log('response: ', response);
        return response;
    }
    return getData();
}

app.com({
    name: 'j-content',
    data: data,
    tpl() {
        return `
            <div j-load="data.current_page_content">
                <h1>{{data.current_page_title}}</h1>
                {{data.current_page_content}}
            </div>
        `
            ;
    },
    created() {
        console.log('Component created');
    },
    async mount() {
        await this.loadPage('getting-started');
    },
    async updated(key, val) {
        if (key === 'current_page') {
            await this.loadPage(val);
        }
    },
    methods: {
        async loadPage(slug) {
            const url = `http://componentor.main/w/wp-json/wp/v2/docs?slug=${slug}`;
            if (url === 'dev-doc') {//start page for now
                url = this.data.start_page;
            }
            console.log('url: ', url);
            const res = await fetch(url);
            const json = await res.json();
            this.data.current_page_title = json[0].title.rendered;
            this.data.current_page_content = json[0].content.rendered;
        }
    }
    // methods: {
    //     getSlug() {
    //         if (this.data.current_page) {
    //            return this.data.current_page;
    //         }
    //         //if direct link get slug from url
    //         let slug;
    //         let url = window.location.href; 
    //         let host = window.location.origin;
    //         let slugFromUrl = url.replace(host,'').replace('/','').replace('.html','');//get clean slug
    //         // if ( slugFromUrl === 'docs' ) {//from physical doc.html
    //         console.log('slugFromUrl: ', slugFromUrl);
    //         if ( slugFromUrl === 'dev-1' ) {//dev-v
    //             slug = this.data.start_page_slug;//replacing if physical page slug(like index.html), with start 
    //         } else{
    //             slug = this.slugFromUrl;
    //         }
    //             console.log('slug: ', slug);
    //         return slug;

    //     },
    // },
    // async mount() { 
    //     // console.log('this.getSlug(): ', this.getSlug());
    //     let url =` http://componentor.main/w/wp-json/wp/v2/docs?slug=${this.getSlug()}`;
    //     // console.log('url: ', url);
    //     let page_object = await getApi(url);
    //     // console.log('page_object: ', page_object);
    //     this.data.current_page_title = page_object[0].title.rendered;
    //     this.data.current_page_content = page_object[0].content.rendered;
    //     // this.render();
    // }
})




app.com({
    name: 'j-menu',
    data: data,
    tpl() {
        return `
            <ul j-load="data.menu_side" class="fd-c g-05 p-1">
                <li j-for="data.menu_side">
                    <a href="{{e.slug}}" @click.prevent="changeCurrent({{e.slug}},{{e.title}})">{{e.title}}</a>
                </li>
            </ul>
            `
            ;
    },
    methods: {
        changeCurrent(slug, title) {
            const state = { path: slug };
            history.pushState(state, title, slug);
            // console.log('this.data.current_pag before ', data.current_page);
            this.data.current_page = slug;
            // console.log('this.data.current_pag after ', data.current_page);
            this.e;//added event(by default isdata-updated) manualy too, though proxy should do it automaticaly on data change
        }
    },

    async mount() {
        this.data.menu_side = await getApi('http://componentor.main/w//wp-json/custom/menu/docs');
        // this.noneExistsMethod();
    }
})