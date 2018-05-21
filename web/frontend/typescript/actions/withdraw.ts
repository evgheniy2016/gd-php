export function withdrawPage() {
    const specificFields = document.querySelectorAll('[data-withraw-type]');
    const typeSelect = document.querySelector('#withdraw-type');
    const fieldsMap = { };
    for (let i = 0; i < specificFields.length; i++) {
        specificFields[i].classList.add('hidden');
        const fieldType = specificFields[i].getAttribute('data-withraw-type');
        if (typeof fieldsMap[fieldType] === "undefined") {
            fieldsMap[fieldType] = [];
        }
        fieldsMap[fieldType].push(specificFields[i]);
    }

    typeSelect.addEventListener('change', (event) => {
        const selectedIndex: number = (typeSelect as HTMLSelectElement).selectedIndex;
        const selectedItem = (typeSelect as HTMLSelectElement).options[selectedIndex];
        const selectedType = selectedItem.getAttribute('data-type');
        if (typeof fieldsMap[selectedType] !== "undefined") {
            for (let i = 0; i < specificFields.length; i++) {
                specificFields[i].classList.add('hidden');
            }
            fieldsMap[selectedType].forEach(item => {
                item.classList.remove('hidden');
            });
        }
    });
}