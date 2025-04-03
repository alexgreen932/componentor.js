import { updateNestedProperty } from './help-functions.js';

export default function jModel() {
	const items = this.querySelectorAll('[j-model]');
	if (items.length === 0) return;

	items.forEach(item => {
		const keyPath = item.getAttribute('j-model');
		let propValue = this.getDynamicData(keyPath);

		if (propValue !== undefined) {
			item.value = propValue;
		}

		item.addEventListener('input', (e) => {
			let newValue = e.target.value;
			console.log('newValue: ', newValue); // now it should show!
			updateNestedProperty(this, keyPath, newValue);
		});

		item.removeAttribute('j-model'); // optional
	});
}

