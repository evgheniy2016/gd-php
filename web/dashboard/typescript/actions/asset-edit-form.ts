function deleteCollectionItem(button) {
  return () => {
    const itemId = button.getAttribute('data-id');
    const targetItem = document.querySelector('[data-item-id="' + itemId + '"]');
    targetItem.parentElement.removeChild(targetItem);
  }
}

export function assetEditForm() {

  const deleteButtons = document.querySelectorAll('[data-delete-collection-item]');
  const addButtons = document.querySelectorAll('[data-add-collection-item]');

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteCollectionItem(deleteButtons[i]));
  }

  console.log(addButtons);

  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', () => {
      const collectionContainer = addButtons[i].parentElement.parentElement;
      const itemContainer = document.createElement('div');
      const index = collectionContainer.querySelectorAll('.collection-item').length;
      const itemFooter = document.createElement('div');
      const deleteButton = document.createElement('a');
      let prototype = collectionContainer.getAttribute('data-prototype');

      while (prototype.indexOf('__name__') > -1) {
        prototype = prototype.replace('__name__', index + '');
      }

      itemContainer.innerHTML = prototype;
      itemContainer.classList.add('collection-item');
      itemContainer.setAttribute('data-item-id', index + '');

      itemContainer.appendChild(itemFooter);
      itemFooter.appendChild(deleteButton);

      itemFooter.classList.add('collection-item-footer');

      deleteButton.innerHTML = 'delete';
      deleteButton.setAttribute('data-id', index + '');
      deleteButton.addEventListener('click', deleteCollectionItem(deleteButton));
      deleteButton.setAttribute('data-delete-collection-item', 'data-delete-collection-item');

      collectionContainer.insertBefore(itemContainer, addButtons[i].parentElement);
    });
  }

}