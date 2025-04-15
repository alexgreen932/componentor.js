// methods/log.js
export default function log(message = '', data = null, style = 'blue', type = 'log') {
	if (!window.app?.debug) return;

	const tag = `[${this?.name || this?.tagName?.toLowerCase() || 'component'}]: `;

	const styles = {
		b: 'background:#00ace6; color: #fff; padding:3px;font-weight:bold;',
		blue: 'background:#00ace6; color: #fff; padding:3px;font-weight:bold;',
		r: 'background:#f00; color: #fff; padding:3px;;font-weight:bold;',
		red: 'background:#f00; color: #fff; padding:3px;;font-weight:bold;',
		d: 'background:#404550; color: #fff; padding:3px;;font-weight:bold;',
		dark: 'background:#404550; color: #fff; padding:3px;;font-weight:bold;',
		error: 'background:#ad1457; color: #fff; padding:3px; font-weight:bold;;font-weight:bold;',
	};

	const logStyle = styles[style] || styles.blue;

	if (type === 'warn') {
		console.warn(`%c${tag}${message}`, logStyle, data || '');
	} else if (type === 'error') {
		console.error(`%c${tag}${message}`, logStyle, data || '');
	} else {
		console.log(`%c${tag}${message}`, logStyle, data || '');
	}
}

