export default function log(key, msg = '', data = '', time = null) {

    if (!app.dev) return;
    //todo add condition app.dev
    if (app.watchers[key]) {
        const ignoreList = ['develop-console', 'j-logs', 'j-components', 'j-watchers', 'j-errors'];
        const tag = this?.tagName?.toLowerCase?.() || 'unknown';
        if (ignoreList.includes(tag)) return;

        const log = {
            tag,
            key,
            msg,
            data,
            time: time || new Date().toLocaleTimeString('en-GB') + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
        };

        if (key === 'Error') {
            app.errors.unshift(log);
        } else {
            app.logs.unshift(log);
        }
        const event = new Event('j_log', { bubbles: true });
        this.dispatchEvent(event);
    } else {

        // console.log(' Key is FALSE -----------');  
    }


}
