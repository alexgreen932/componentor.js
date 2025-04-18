// jModel.js
import { updateNestedProperty, resolveDataPath} from './help-functions.js';

export default function jModel() {
	const items = this.querySelectorAll('[j-model]');
	if (items.length === 0) return;

	items.forEach(item => {
		const keyPath = item.getAttribute('j-model');
		let propValue = resolveDataPath(this, keyPath);

		if (propValue !== undefined) {
			item.value = propValue;
		}

		item.addEventListener('input', (e) => {
			let newValue = e.target.value;
			updateNestedProperty(this, keyPath, newValue); // updates proxied this.keyPath
		});

		item.removeAttribute('j-model');
	});
}
