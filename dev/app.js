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
    console.log('Log 42: ', data.items);
}, 2000);


com({
    name: 'my-app',
    data: data,
    tpl() {
        return `
            <ul class="w-container-c g-1 pv-3">
                <li class="bs-2 p-1 pos-r" j-for="(e, i) in data.items">
                {{e.content}}
                <div class="de pos-a-0000 ai-c jc-e g-05 pr-1">
                    <i class="fa-solid fa-angle-up j-click"></i>
                    <i class="fa-solid fa-angle-down j-click"></i>
                    <i class="fa-solid fa-trash j-click" @click="del({{i}})"></i>
                </div>
                </li>
            </ul> 
            <div class="w-container pv-1">  
                <div class="fd-c fg-1 g-05 p-1 bg-blue-grey-l-5">  
                    <input type="text" value="{{data.input}}" />
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
        del(e) {
            this.e();
        }
    },
    mount(){
        console.log('this.data.current on loading -- ', this.data);
    }
});
