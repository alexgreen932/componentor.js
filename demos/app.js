const data = {
    current: 'post1',
    posts: [
        { title: 'Post 1', slug: 'post1', content: 'Lorem ipsum dolor sit amet. Est dolor minima quo dignissimos placeat ab nesciunt Quis ut enim possimus 33 quia quam est animi facere. Est consequatur enim vel quibusdam galisum ut iusto obcaecati et rerum doloribus et enim modi. A nihil consectetur At commodi dolore est autem atque.' },
        { title: 'Post 2', slug: 'post2', content: 'Sit dolorem nihil sit quam omnis hic itaque modi qui rerum omnis cum fugiat dolorum in exercitationem quaerat. Qui architecto iusto sit sunt nostrum et ducimus minus rem expedita nobis vel magnam enim? Aut voluptas iusto cum molestiae dolor et alias iusto et pariatur iste vel nisi sequi.' },
        { title: 'Post 3', slug: 'post3', content: 'A tempora soluta et illo rerum ut earum quia id reprehenderit vero. Est quidem facilis a fuga modi et accusantium vero 33 tempore architecto non odio dolores in perferendis voluptatem in aliquam recusandae. Et perspiciatis aspernatur At repellat atque aut aliquid magnam aut adipisci dolorem et dolor rerum.' },
        { title: 'Post 4', slug: 'post4', content: 'Et ratione consectetur quo illo pariatur sed voluptas praesentium qui natus nihil et aliquid sint in distinctio dolorum. Ab consequatur sequi aut ipsum magni ad rerum quia non deserunt explicabo ut fugiat quia.' },
        { title: 'Post 5', slug: 'post5', content: 'Eos blanditiis quia a similique eius et laboriosam neque? Ut voluptatem sequi aut molestiae voluptatum qui amet modi eos suscipit internos id quos quos' },
    ],
};
app.el({
    name: 'my-app',
    data: data,
    tpl() {
        return `
            <div id="main-area" class="w-container g-1 pv-1">
                <div class="w-20 bs-2 p-1">
                    <h3 class="b-b">Menu</h3>
                    <ul class="fd-c g-05">
                        <li j-for="e in data.posts"><a href="#" class="j-click" @click="data.current={{e.slug}}">{{e.title}}</a></li>
                    </ul>
                </div>
                <div class="bs-1 p-1 fg-1">
                    <div j-for="e in data.posts">
                        <div j-if="data.current=={{e.slug}}">
                            <h3>{{e.title}}</h3>
                            <div>{{e.content}}</div>
                        </div>
                    </div>
                </div>
            </div>           
        `;
    },
});
