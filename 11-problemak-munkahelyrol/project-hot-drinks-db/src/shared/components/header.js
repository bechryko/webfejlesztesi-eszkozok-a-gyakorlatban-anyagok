class Header extends HTMLElement {
  static #TITLE = 'Hot Drinks Database';
  static #INNER_HTML = `
    <div class="title-container">
      <img src="assets/images/app-icon.png" alt="Hot Drinks Database icon left">
      <h1>${Header.#TITLE}</h1>
      <img src="assets/images/app-icon.png" alt="Hot Drinks Database icon right">
    </div>
    <hddb-navigation-bar></hddb-navigation-bar>
  `;

  connectedCallback() {
    this.innerHTML = Header.#INNER_HTML;

    document.addEventListener('readystatechange', () => {
      if (document.readyState !== 'complete') {
        return;
      }

      document.title = `${Header.#TITLE} - ${PageInformationService.getInstance().pageName}`;
    });
  }
}

customElements.define('hddb-header', Header);
