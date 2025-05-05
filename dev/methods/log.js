export default function log(key, msg = '', data = '', time = null) {
    if (!app.dev && !app.watchers[key]) return;

    const ignoreList = ['develop-console', 'j-logs', 'j-components', 'j-watchers'];
    const tag = this?.tagName?.toLowerCase?.() || 'unknown';
    if (ignoreList.includes(tag)) return;

    const log = {
        tag,
        key,
        msg,
        data,
        time: time || new Date().toLocaleTimeString('en-GB') + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
    };

    app.logs.unshift(log);
    const event = new Event('j_log', { bubbles: true });
    this.dispatchEvent(event);
}
