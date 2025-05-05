import { com } from '../com.js';
import  './j-components.js';
import  './j-logs.js';
import  './j-watchers.js';

const data = {
    title: 'My app',
    tabs: [
        { title: 'App Components', slug: 'info', icon: 'ℹ️' },
        { title: 'Logs', slug: 'logs', icon: '🖹' },
        { title: 'Watchers', slug: 'watchers', icon: '👁' },
        { title: 'Settings', slug: 'settings', icon: '⚙' },
        { title: 'Close', slug: null, icon: '❌' },
    ],
    state: {
        current: null,
        current: 'watchers',//testing
    },

    // show_cls: 'info',
}



com({
    name: 'develop-console',
    data: data,
    tpl() {
        return html`    
            <div id="debug-panel" class="{{show()}}">
                <div class="db-icons">
                    <template j-for="tabs">
                        <span class="de" @click="tab('[e.slug]')">[e.icon]</span>
                    </template>
                </div>
                <div class="debug-window db-dark db-bottom-right db-large ">
                    <div class="db-inner">
                        <div class="db-inner-icons">
                            <template j-for="tabs">
                                <span class="de" @click="tab('[e.slug]')">[e.title]</span>
                            </template>
                        </div>
                        <div class="db-inner-data">
                            <j-components class="j_inherit" j-if="state.current=='info'"></j-components>
                            <j-logs class="j_inherit" j-if="state.current=='logs'"></j-logs>
                            <j-watchers class="j_inherit" j-if="state.current=='watchers'"></j-watchers>
                            ---
                        </div>
                    </div>
                    <div j-if="state.current==watchers">
                        watchers
                    </div>
                    <div j-if="state.current==logs">
                        log
                    </div>
                    <div j-if="state.current==settings">
                        settings
                    </div>
                </div>
            
            </div>
            <textarea>{{state.current}}</textarea>
            <textarea>{{func()}}</textarea>
        `
    },
    methods: {
        tab(s) {
            if (s === this.state.current) {
                this.state.current = null;
            } else {
                this.state.current = s;
            }
            // console.log('s ---- ', s);

        },
        show() {
            if (this.state.current) {
                return 'console-active';
            } else {
                return '';
            }
        },
        func() { return 'return method func' },
    },
    mount() {
        // console.log('this.data ---------------- ', this.data);
    },

    // saveLocally() {
    //     return [this.data, 'savedDevSettings'];
    // }
    // css:'.test-h{color:#f00}'
})