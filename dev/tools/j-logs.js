import { com } from '../com.js';



com({
    name: 'j-logs',
    data: {
        logs: null,
    },
    r: 'j_log',
    tpl() {
        return html` 
        <h3>Logs</h3>
        <ul j-load="logs" class="j_logs">
            <li j-for="logs">
                <span class="j_log_name">[e.key]</span>
                <span class="j_log_tag">[e.tag]</span>
                <span class="j_log_msg">[e.msg]</span>
                <span class="j_log_data">[e.data]</span>
            </li>
        </ul>
         `
    },
    // if (message) {
    //     msg = `<span class="j_log_msg">${message}</span>`;
    // } 
    // if (data) {
    //     d = `<span class="j_log_data">[${data}]</span>`;
    // } 
    // let log = `
    //     <span class="j_log_name">[${watcherKey}]</span>       
    //     ${msg}
    //     ${d}
    // `;
    methods: {
        showData(d) {
            //todo beatify
            console.log('d---- ', d);

        },
    },
    created() {
        this.logs = app.logs;
        console.log('logs ------ ', this.logs[0]);
        // console.log('app---------', app.logs);
    }
})

