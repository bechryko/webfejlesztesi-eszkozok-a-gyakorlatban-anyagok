class DrinkTile extends HTMLElement {
  #drink;
  #dialogElement;

  static get observedAttributes() {
    return ['drink-data'];
  }

  connectedCallback() {
    this.classList.add('secondary-container');
  }

  attributeChangedCallback(attrName, _, newValue) {
    switch (attrName) {
      case 'drink-data':
        this.#drink = JSON.parse(newValue);
        this.#update();
        break;
    }
  }

  #update() {
    const template = document.createElement('template');
    const likedHTML = `
      <p class="liked chip tertiary-container">You <span class="${
        this.#drink.liked ? 'like' : 'dislike'
      }">${this.#getLikedMessage()}</span> it</p>
    `;
    template.innerHTML = `
      <h3>${this.#drink.name}</h3>
      <p class="category">${this.#drink.category ?? ''}</p>
      <p class="status chip tertiary-container">${this.#getStatusMessage()}</p>
      ${this.#drink.status === 'to-drink' ? '' : likedHTML}
      <button class="delete error">X</button>
      ${this.#getDialogHTML()}
    `;
    this.append(template.content);

    this.querySelector('button.delete').onclick = this.#deleteDrink.bind(this);
    this.#dialogElement = this.querySelector('dialog');
    this.#dialogElement.querySelector('.actions-container button#confirm-delete').onclick =
      this.#confirmDelete.bind(this);
    this.#dialogElement.querySelector('.actions-container button#cancel-delete').onclick =
      this.#cancelDelete.bind(this);
  }

  #deleteDrink() {
    this.#dialogElement?.showModal();
  }

  #confirmDelete() {
    DrinksService.getInstance().deleteDrink(this.#drink);
    this.#dialogElement?.close();
  }

  #cancelDelete() {
    this.#dialogElement?.close();
  }

  #getStatusMessage() {
    switch (this.#drink.status) {
      case 'tasted':
        return 'Tasted';
      case 'to-drink':
        return 'To-drink';
    }

    throw new Error('Unknown status:', this.#drink.status);
  }

  #getLikedMessage() {
    return this.#drink.liked ? 'liked' : 'did not like';
  }

  #getDialogHTML() {
    return `
      <dialog class="modal secondary-container">
        <h4>Confirm delete</h4>
        <p>Are you sure you want to delete the drink "${this.#drink.name}"?</p>
        <div class="actions-container">
          <button id="confirm-delete" class="error">Confirm</button>
          <button id="cancel-delete" class="secondary">Cancel</button>
        </div>
      </dialog>
    `;
  }
}

customElements.define('hddb-drink-tile', DrinkTile);
