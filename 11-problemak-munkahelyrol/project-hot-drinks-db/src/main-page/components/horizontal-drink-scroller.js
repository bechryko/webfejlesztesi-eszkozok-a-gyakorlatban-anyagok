class HorizontalDrinkScroller extends HTMLElement {
  #drinkCategory;
  #savedDrinkNames = [];

  static get observedAttributes() {
    return ['drink-type'];
  }

  connectedCallback() {
    this.classList.add('primary-container');

    document.addEventListener('readystatechange', () => {
      if (document.readyState !== 'complete') {
        return;
      }

      DrinksService.getInstance().drinks$.subscribe(drinks => {
        this.#savedDrinkNames = drinks.map(drink => drink.name);
        this.#update();
      });
    });
  }

  attributeChangedCallback(attrName, _, newValue) {
    switch (attrName) {
      case 'drink-type':
        this.#drinkCategory = newValue;
        this.#update();
        break;
    }
  }

  #update() {
    this.#removeDrinkEntries();

    const template = document.createElement('template');
    template.innerHTML = this.#filteredDrinkNames.map(drinkName => this.#getDrinkEntryHTML(drinkName)).join('\n');
    if (template.innerHTML.length === 0) {
      template.innerHTML = `
        <p class="no-recommendation">No recommended drinks</p>
      `;
    }
    this.append(template.content);

    this.#filteredDrinkNames.forEach(drinkName => {
      const formattedDrinkName = this.#getDrinkElementId(drinkName);
      this.querySelector(`button#like-button-${formattedDrinkName}`).onclick = this.#likeDrink.bind(this, drinkName);
      this.querySelector(`button#dislike-button-${formattedDrinkName}`).onclick = this.#dislikeDrink.bind(
        this,
        drinkName
      );
      this.querySelector(`button#todo-button-${formattedDrinkName}`).onclick = this.#todoDrink.bind(this, drinkName);
    });
  }

  #removeDrinkEntries() {
    this.querySelectorAll('.drink-entry-container, p.no-recommendation').forEach(entryContainer => {
      this.removeChild(entryContainer);
    });
  }

  #getDrinkEntryHTML(name) {
    const formattedDrinkName = this.#getDrinkElementId(name);
    return `
      <div class="drink-entry-container">
        <h3>${name}</h3>
        <div class="actions-container">
          <button id="like-button-${formattedDrinkName}" class="primary">
            <i>favorite</i>
            <div class="tooltip bottom">Liked it</div>
          </button>
          <button id="dislike-button-${formattedDrinkName}" class="error">
            <i>heart_broken</i>
            <div class="tooltip bottom">Not liked it</div>
          </button>
          <button id="todo-button-${formattedDrinkName}" class="secondary">
            <i>list</i>
            <div class="tooltip bottom">Want to try</div>
          </button>
        </div>
      </div>
    `;
  }

  #likeDrink(drinkName) {
    QuickActionsService.getInstance().likeDrink(this.#drinkCategory, drinkName);
  }

  #dislikeDrink(drinkName) {
    QuickActionsService.getInstance().dislikeDrink(this.#drinkCategory, drinkName);
  }

  #todoDrink(drinkName) {
    QuickActionsService.getInstance().listDrink(this.#drinkCategory, drinkName);
  }

  #getDrinkElementId(drinkName) {
    return this.#drinkCategory + drinkName.toLowerCase().replaceAll(' ', '-');
  }

  get #filteredDrinkNames() {
    return recommendations[this.#drinkCategory].filter(drinkName => !this.#savedDrinkNames.includes(drinkName));
  }
}

customElements.define('hddb-horizontal-drink-scroller', HorizontalDrinkScroller);
