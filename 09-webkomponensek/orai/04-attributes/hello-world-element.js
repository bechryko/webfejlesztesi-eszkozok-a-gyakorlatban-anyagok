const helloWorldElementTemplate = document.createElement("template");
helloWorldElementTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      padding: 2rem;
      margin: auto;
      font-size: 2rem;
      border: 1px solid black;
      border-radius: 1.5rem;
      width: fit-content;
      height: fit-content;
      background-color: lime;
    }

    p {
      margin: 0;
      text-align: center;
      width: fit-content;
      user-select: none;
    }
  </style>

  <p>Hello World!</p>
`;

class HelloWorldElement extends HTMLElement {
  /* JavaScript privát adattagok deklarációja. */
  #backgroundColor;
  #toggledBackgroundColor;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.append(helloWorldElementTemplate.content.cloneNode(true));

    this.addEventListener("click", () => {
      this.swapBackgroundColor();
    });
  }

  swapBackgroundColor() {
    this.style.backgroundColor =
      this.style.backgroundColor === this.#backgroundColor ? this.#toggledBackgroundColor : this.#backgroundColor;
    this.toggled = !this.toggled;
  }

  /* Így lehet egy JavaScript tömbben megadni, hogy milyen attribútumokat érzékeljen a HTML
  elemünk. Ezeknek a változásakor lesz meghívva az attributeChangedCallback. Mivel a "toggled"
  attribútum változásakor nem akarunk csinálni semmit ott, ezért ide sem kell beírni. */
  static get observedAttributes() {
    return ["background-color", "toggled-background-color"];
  }

  /* Ez a metódus a JavaScript-es custom HTMLElement-ek része. Paraméterben meg fogja kapni a
  megváltoztatott attribútum nevét, régi és új értékét, hogy lehessen kódot írni, mi történjen, ha
  a változás végbemegy. */
  attributeChangedCallback(attrName, oldValue, newValue) {
    switch(attrName) {
      case "background-color":
        this.#backgroundColor = newValue;
        if(!this.toggled) {
          this.style.backgroundColor = newValue;
        }
        break;
      case "toggled-background-color":
        this.#toggledBackgroundColor = newValue;
        if(this.toggled) {
          this.style.backgroundColor = newValue;
        }
        break;
    }
  }

  /* Getter és setter JavaScript-ben. Így most nem "on" és "off" string-ként kell kezelnünk az
  értékeit az osztályon belül, hanem egyszerű boolean értékekként. */

  get toggled() {
    /* A HTML elem getAttribute metódusával szövegként le lehet kérni adott attribútum értékét. */
    return this.getAttribute("toggled") === "on";
  }

  set toggled(value) {
    /* A setAttribute segítségével pedig be lehet állítani azt. */
    this.setAttribute("toggled", value ? "on" : "off");
  }
}

customElements.define("hello-world", HelloWorldElement);
