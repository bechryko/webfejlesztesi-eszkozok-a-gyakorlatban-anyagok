class PageWrapper extends HTMLElement {
  static #RXJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/7.8.1/rxjs.umd.js';
  static #BEER_CSS_STYLE_SRC = 'https://cdn.jsdelivr.net/npm/beercss@3.10.8/dist/cdn/beer.min.css';
  static #BEER_CSS_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/beercss@3.10.8/dist/cdn/beer.min.js';
  static #BEER_CSS_DYNAMIC_COLORS_SCRIPT_SRC =
    'https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.2/dist/cdn/material-dynamic-colors.min.js';

  #onPageInformationServiceLoad = () => {};

  connectedCallback() {
    const createChildJs = document.createElement('script');
    createChildJs.src = 'shared/functions/create-child.js';
    createChildJs.onload = () => this.#addScripts();
    this.appendChild(createChildJs);

    document.body.classList.add('light');
  }

  #addScripts() {
    createChild(this, 'script', { src: PageWrapper.#RXJS_SRC });
    // createChild(this, 'link', {
    //   href: PageWrapper.#BEER_CSS_STYLE_SRC,
    //   rel: 'stylesheet'
    // });
    createChild(this, 'script', {
      src: PageWrapper.#BEER_CSS_SCRIPT_SRC,
      type: 'module'
    });
    createChild(this, 'script', {
      src: PageWrapper.#BEER_CSS_DYNAMIC_COLORS_SCRIPT_SRC,
      type: 'module'
    });

    createChild(this, 'script', { src: 'shared/components/header.js' });
    createChild(this, 'script', { src: 'shared/components/navigation-bar.js' });
    const pageInformationServiceScript = createChild(this, 'script', {
      src: 'shared/services/page-information-service.js'
    });
    pageInformationServiceScript.onload = this.#onPageInformationServiceLoad;
    createChild(this, 'script', { src: 'shared/services/indexed-db-handler.js' });
    createChild(this, 'script', { src: 'shared/functions/navigate-with-href.js' });
  }

  static get observedAttributes() {
    return ['page-name'];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'page-name':
        this.#onPageInformationServiceLoad = () => {
          PageInformationService.register(newValue);
        };
        break;
    }
  }
}

customElements.define('hddb-page-wrapper', PageWrapper);
