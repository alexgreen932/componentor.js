export default function controls() {
    // Ensure event listener is attached only once
    if (this._controlsInitialized) return;
    this._controlsInitialized = true;

    let formActive = false;

    this.addEventListener('mouseenter', () => {
        if (formActive) return;
        formActive = true;
        if (this.querySelector('.control-block')) return; // Prevent adding duplicate controls

        let controlBlock = document.createElement('div');
        controlBlock.classList.add('control-block');
        controlBlock.innerHTML = `<i class="ja-edit fa-solid fa-pen-to-square"></i>`; 

        this.before(controlBlock);

        controlBlock.querySelector('.ja-edit').addEventListener('click', () => {
            console.log('Edit button clicked');

            // Remove existing form if another component has one open
            document.getElementById('jform')?.remove();

            // Ensure controlsData exists before accessing properties
            if (!this.controlsData || !this.controlsData.cls || !this.controlsData.obj) {
                console.error("controlsData is missing or incomplete on", this);
                return;
            }

            // Insert form after the component
            this.insertAdjacentHTML(
                "afterend",
                `<form id="jform" class="${this.controlsData.cls}">
                    ${formContent(this[this.controlsData.obj], this.controlsData, this)}
                </form>`
            );
        });
    });
}

// ✅ Field renderers
window.field_text = (key, value) =>
    `<input type="text" id="${key}" name="${key}" value="${value}">`;

window.field_select = (key, value, ops = []) => {
    let options = ops.map(op =>
        `<option value="${op}" ${op === value ? 'selected' : ''}>${op}</option>`
    ).join('');
    return `<select id="${key}" name="${key}">${options}</select>`;
};

function formContent(dataObject, el, componentInstance) {
    if (!dataObject || !el || !Array.isArray(el.fields)) {
        console.error("Invalid arguments passed to formContent:", { dataObject, el });
        return "<p>Error: Invalid form data</p>";
    }

    let fields = el.fields.map(element => {
        let funcName = `field_${element.type}`;
        let fieldRenderer = window[funcName] instanceof Function ? window[funcName] : null;
        let fieldHtml = fieldRenderer ? fieldRenderer(element.key, dataObject[element.key], element.ops || []) : `Unknown field type: ${element.type}`;

        return `
            <div class="control-group">
                <label for="${element.key}">${element.label}</label>
                ${fieldHtml}
            </div>
        `;
    }).join('');

    setTimeout(() => attachFormListeners(el.fields, dataObject, componentInstance), 0);

    return `<h2>${el.title}</h2>${fields}`;
}

function attachFormListeners(fields, dataObject, componentInstance) {
    if (!Array.isArray(fields) || typeof dataObject !== "object" || !componentInstance) {
        console.error("Invalid arguments passed to attachFormListeners:", { fields, dataObject, componentInstance });
        return;
    }

    fields.forEach(element => {
        let input = document.getElementById(element.key);
        if (input) {
            input.addEventListener('input', (e) => {
                dataObject[element.key] = e.target.value; // ✅ Update data reactively
                if (typeof componentInstance.render === "function") {
                    componentInstance.render(); // ✅ Ensure render exists before calling
                } else {
                    console.error("componentInstance.render() is not a function on", componentInstance);
                }
            });
        }
    });
}
