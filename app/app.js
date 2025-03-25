const data = {
    title: 'Componentor.js',
    description: 'My Start App Example',
    menu: [
        {title: 'Home', path:'home'},
        {title: 'About', path:'about'},
        {title: 'Contact', path:'contact'},
    ],
};

//root component
app.com({
    name: 'my-app',
    data: {
        title: 'Componentor.js',
        description: 'My Start App Example',
        menu_main: [
            {title: 'Home', path:'home'},
            {title: 'About', path:'about'},
            {title: 'Contact', path:'contact'},
        ],
        menu_demos: [
            {title: 'Todo List', path:'demos/todo-list.html'},
            {title: 'Posts', path:'demos/posts.html'},
        ],
        menu_tests: [
            {title: 'Todo List', path:'tests/todos/'},
        ],
    },
    tpl() {
        return `
            <div class="w-container-c full-height jc-c ai-c">
                <i class="fa-solid fa-puzzle-piece fs-35 tx-blue"></i>
                <h1>{{data.title}}</h1>
                <div>{{data.description}}</div>
                <my-menu el="data.menu_main"></my-menu>
                <my-menu el="data.menu_demos"></my-menu>
                <my-menu el="data.menu_tests"></my-menu>
            </div>
        `;
    }
});

//child component
app.com({
    name: 'my-menu',
    tpl() {
        return `
            <ul class="p-1 g-1 b-t">
                <li j-for="e in el"><a href="{{e.path}}" target="_blank">{{e.title}}</a></li>
            </ul>
        `;
    }
});
