import { com } from './componentor.js';

const data = {
    items: [
        { content: 'Lorem ipsum dolor sit amet' },
        { content: 'Consectetur adipiscing elit' },
        { content: 'Ut enim ad minim veniam' },
    ],
    input: 'New TODO',
};

setInterval(() => {
    console.log('Log 42: ', data.input);
}, 2000);


com({
    name: 'my-app',
    data: data,
    r: false, //!important forbid auto rerender, or you will not be able to change input as it will be updating on every letter input
    tpl() {
        return `
            <ul class="fd-c g-1">
                <li class="pos-r" j-for="(e, i) in data.items">
                    {{e.content}}
                    <div class="de pos-a-0000 ai-c jc-e g-05 pr-1">
                        <i j-if="notFirst({{i}})" class="fa-solid fa-angle-up j-click" @click="move({{i}}, 'up')"></i>
                        <i j-if="notLast({{i}})" class="fa-solid fa-angle-down j-click" @click="move({{i}})"></i>
                        <i class="fa-solid fa-trash j-click" @click="del({{i}})"></i>
                    </div>
                </li>
            </ul> 
            <div class="mv-1">  
                <div class="fd-c fg-1 g-05 p-1 bg-blue-grey-l-5">  
                    <input type="text" j-model="data.input" />
                    <div class="b-blue" @click="add()">Add</div>
                </div>          
            </div>   
        `;
    },
    methods: {
        add() {
            let item = { content: this.data.input };
            // console.log('item: ', item);
            this.data.items.push(item);
            this.e();
        },
        notFirst(i) {
            if (i !== 0) return true;
        },
        notLast(i) {
            let last = this.data.items.length - 1;
            if (i !== last) return true;
        },
        //todo make move global, addind argumemnt 'arr' for using directly in event handlers
        move(i, to='down') {
            let arr = this.data.items;
            let elem = arr[i];
            let new_pos;
            if (to !== 'down') {
                new_pos = parseInt(i) - 1;
            } else {
                new_pos = parseInt(i) + 1;
            }            
            this.data.items.splice(i, 1);
            this.data.items.splice(new_pos, 0, elem);
            this.e();
        },
        del(i) {
            this.data.items.splice(i, 1);
            this.e();
        }
    },
    mount() {
    }
});
