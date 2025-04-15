export { trace } from './trace.js';

//render screens
import renderAppInfo from './console/renderAppInfo.js';
import { hookConsoleError, hookConsoleWarn, hookConsoleLog, hookGlobalErrors, hookUnhandledRejections } from './console/hooks.js';

import { renderSettings, getStyleSettings } from './renderSettings.js';
import navigateApp from './console/navigateApp.js';

//TODO
//add class active in win tab
//add DevTools to app
//maybe add trace to app and do app.t

export function devConsole() {
	initDebugUI();
	hookConsoleError();
	hookConsoleWarn();
	hookConsoleLog();
	hookGlobalErrors();
	hookUnhandledRejections();
	bindDebugShortcut();
}



function initDebugUI() {
	const { styleClass, positionClass, sizeClass, keepOpen } = getStyleSettings();
	const container = document.createElement('div');
	container.id = 'debug-panel';
	const cList = [styleClass, positionClass, sizeClass];
	container.classList.add(...cList);
	container.innerHTML = `
		<div id="debug-icons">
			<button id="debug-info-btn">\u2139\ufe0f</button>
			<button id="debug-error-btn" style="display:none;">!</button>
			<button id="debug-warn-btn" style="display:none;">\u26a0\ufe0f</button>
			<button id="debug-log-btn" style="display:none;">\u270d\ufe0f</button>
		</div>
		<div id="debug-window" class="${styleClass} ${positionClass} ${sizeClass}" style="display: ${keepOpen ? 'block' : 'none'};">
			<div id="debug-tabs">
				<button data-tab="info">App Info</button>
				<button data-tab="errors">Errors</button>
				<button data-tab="warnings">Warnings</button>
				<button data-tab="renders">Renders</button>
				<button data-tab="logs">Logs</button>
				<button data-tab="settings">\u2699</button>
			</div>
			<div id="debug-content"></div>
		</div>
	`;
	document.body.appendChild(container);

	const infoBtn = document.getElementById('debug-info-btn');
	const errorBtn = document.getElementById('debug-error-btn');
	const warnBtn = document.getElementById('debug-warn-btn');
	const logBtn = document.getElementById('debug-log-btn');
	const windowEl = document.getElementById('debug-window');
	const contentEl = document.getElementById('debug-content');
	const tabs = document.querySelectorAll('#debug-tabs button');

	infoBtn.onclick = () => {
		toggleDebugWindow(windowEl);
		renderAppInfo(contentEl);
	};
	errorBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderErrors(contentEl);
	};
	warnBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderWarnings(contentEl);
	};
	logBtn.onclick = () => {
		showDebugWindow(windowEl);
		renderLogs(contentEl);
	};

	tabs.forEach(tab => {
		tab.onclick = () => {
			const type = tab.dataset.tab;
			if (type === 'info') renderAppInfo(contentEl);
			else if (type === 'errors') renderErrors(contentEl);
			else if (type === 'warnings') renderWarnings(contentEl);
			else if (type === 'renders') renderRenders(contentEl);
			else if (type === 'logs') renderLogs(contentEl);
			else if (type === 'settings') renderSettings(contentEl, windowEl);
		};
	});

	app._updateErrorIcon = () => {
		errorBtn.style.display = app.errors.length > 0 ? 'inline-block' : 'none';
	};
	app._updateWarnIcon = () => {
		warnBtn.style.display = app.warnings.length > 0 ? 'inline-block' : 'none';
	};
	app._updateLogIcon = () => {
		logBtn.style.display = app.logs && app.logs.length > 0 ? 'inline-block' : 'none';
	};
	navigateApp();
	container.addEventListener('click', ()=> {
		console.log('reinitilize');		
		navigateApp()
	});
}



function toggleDebugWindow(win) {
	win.style.display = win.style.display === 'none' ? 'block' : 'none';
}
function showDebugWindow(win) {
	win.style.display = 'block';
}

function bindDebugShortcut() {
	document.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.key === 'x') {
			const win = document.getElementById('debug-window');
			toggleDebugWindow(win);
			if (win.style.display === 'block') {
				renderAppInfo(document.getElementById('debug-content'));
			}
		}
	});
}

// function renderAppInfo(el) {
// 	el.innerHTML = `
// 		<h3>App Info</h3>
// 		${app.components.map(comp => `
// 			<div style="margin-bottom: 1em;">
// 				<strong>${comp.name}</strong>
// 				<pre>data: ${JSON.stringify(comp.data, null, 2)}</pre>
// 				<pre>methods: ${comp.methods.join(', ')}</pre>
// 				<pre>renders: ${comp.renders || 0} (last: ${comp.lastRenderTime?.toFixed(2) || 'N/A'}ms)</pre>
// 			</div>
// 		`).join('')}
// 	`;
// }

function renderErrors(el) {
	el.innerHTML = `
		<h3>Console Errors</h3>
		<ul>
			${app.errors.length ? app.errors.map(e => `<li>${e}</li>`).join('') : '<li>No errors logged</li>'}
		</ul>
	`;
}

function renderWarnings(el) {
	el.innerHTML = `
		<h3>Console Warnings</h3>
		<ul>
			${app.warnings.length ? app.warnings.map(w => `<li>${w}</li>`).join('') : '<li>No warnings logged</li>'}
		</ul>
	`;
}

function renderLogs(el) {
	const logs = app.logs || [];
	el.innerHTML = `
		<h3>Console Logs</h3>
		<ul>
			${logs.length ? logs.map(l => `<li>${l}</li>`).join('') : '<li>No logs</li>'}
		</ul>
	`;
}

function renderRenders(el) {
	el.innerHTML = `
		<h3>Render Logs</h3>
		${app.components.map(comp => `
			<div style="margin-bottom: 1em;">
				<strong>${comp.name}</strong>
				<pre>renders: ${comp.renders || 0}</pre>
				<pre>Last Render Time: ${comp.lastRenderTime?.toFixed(2) || 'N/A'}ms</pre>
			</div>
		`).join('')}
	`;
}



