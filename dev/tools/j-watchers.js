import { com } from '../com.js';

com({
    name: 'j-watchers',
    r: 'j_watchers',
    data: {
        watchersArr: [] // [ ['rerender', true], ... ]
    },
    tpl() {
        return html`
        <h3>Watchers</h3>
        <h5>Switch on/off watchers you need</h5>
        <ul>
            <li j-for="watchersArr">
                <template j-for="el in e">
                    <label>
                        <input type="checkbox" checked="[el[1]]" @change="toggleWatcher(el[0], $event.target.checked)" /> [el[0]]
                    </label>
                </template>
            </li>
        </ul>
      `;
    },
    methods: {
        toggleWatcher(key, val) {
            app.watchers[key] = val;
            localStorage.setItem('watchers', JSON.stringify(app.watchers));
            this.dispatchEvent(new Event('j_logs', { bubbles: true }));
        }
    },
    created() {
        // Convert app.watchers to array
        this.watchersArr = Object.entries(app.watchers);
        console.log('this.watchersArr: ', this.watchersArr);
    }
});
