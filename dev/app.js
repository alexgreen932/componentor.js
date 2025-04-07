import { com } from './componentor.js';

com({
    name: 'my-app',
    data:{
        items: [
            { title: 'Lorem ipsum dolor sit amet', show: true },
            { title: 'Consectetur adipiscing elit', show: true  },
            { title: 'Ut enim ad minim veniam', show: true  },
        ],
    },

    //3 ways to use j-for
    //full version with index

    // tpl: `
    //     <div j-for="(e, i) in data.items"><strong>{{i}}.</strong> {{e.title}}</div>
    // `,

    //full version without index
    // tpl: `
    //     <div j-for="e in data.items"><strong>{{i}}.</strong> {{e.title}}</div>
    // `,

    //simplified version without key and index
    // tpl: `
    //     <div j-for="data.items"><strong>{{i}}.</strong> {{e.title}}</div>
    // `,

    //using custom key, index

    // tpl: `
    //     <div j-for="(item, index) in data.items"><strong>Item {{index}}.</strong> {{item.title}}</div>
    // `,

    tpl() {
        return `
            <template j-for="data.items">
                <div j-if="{{i}}==1"><strong>{{i}}.</strong> {{e.title}}</div>
                <input type="text" value="{{i}}"/>
            </template>
        `
    },
});
