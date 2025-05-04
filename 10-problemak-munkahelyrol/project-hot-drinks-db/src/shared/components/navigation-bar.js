class NavigationBar extends HTMLElement {
  static #PAGES = [
    {
      name: 'Main',
      code: 'main'
    },
    {
      name: 'Drinks',
      code: 'drinks-overview'
    }
  ];

  connectedCallback() {
    document.addEventListener('readystatechange', () => {
      if (document.readyState !== 'complete') {
        return;
      }

      this.innerHTML = this.#buildInnerHTML();
    });
  }

  #buildInnerHTML() {
    let html = '<nav class="no-space">';

    NavigationBar.#PAGES.forEach(({ name, code }, index) => {
      const isFirst = index === 0;
      const isLast = index === NavigationBar.#PAGES.length - 1;

      html += `<a ${this.#getAttributesString(name, code, isFirst, isLast)}>${name}</a>`;
    });

    html += '</nav>';
    return html;
  }

  #getAttributesString(pageName, pageCode, isFirst, isLast) {
    if (PageInformationService.getInstance().pageName !== pageName) {
      return `class="button ${this.#getRoundClass(
        isFirst,
        isLast
      )}-round" href="${pageCode}-page/${pageCode}-page.html"`;
    }
    return `class="selected button secondary ${this.#getRoundClass(isFirst, isLast)}-round"`;
  }

  #getRoundClass(isFirst, isLast) {
    if (isFirst) {
      return 'left';
    }
    if (isLast) {
      return 'right';
    }
    return 'no';
  }
}

customElements.define('hddb-navigation-bar', NavigationBar);
