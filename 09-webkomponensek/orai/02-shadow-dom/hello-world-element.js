/* Most, a HTML egyszerűbb megadása érdekében egy template elemet hozunk létre. Ennek beállítjuk,
hogy mi legyen a belső HTML-e, majd ezt fogjuk sablonként használni saját HTML elemünkben. */
const helloWorldElementTemplate = document.createElement("template");
helloWorldElementTemplate.innerHTML = `
  <style>
    /* A :host szelektort a Shadow DOM miatt tudjuk használni (lásd: később), hogyha egy style a
    Shadow DOM-ban van, akkor a :host szelektor a shadow root-ra fog utalni, ami az az elem, amihez
    a Shadow DOM-ot csatoltuk - azaz jelen esetben a HelloWorld elemünk. */
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

    /* A :host szelektor után zárójelben meg lehet adni egy másik szelektort is - ezek a stílusok
    akkor lesznek érvényesek az elemre, ha arra érvényes a szelektor. */
    :host(.warning) {
      background-color: red;
      font-weight: bold;
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
  constructor() {
    super();

    /* Az attachShadow metódussal hozhatunk létre a HTML elemen belül egy Shadow DOM-ot. Ez meg
    fogja akadályozni, hogy a belül definiált stílusok a HTML elemünkön kívül is befolyásolják az
    oldalt. A "mode" paraméter azt befolyásolja, hogy a Shadow DOM-on belüli elemek elérhetők
    legyenek-e (pl. JavaScript segítségével) az elemen kívülről. */
    const shadowRoot = this.attachShadow({ mode: "closed" });
    /* Itt a Shadow DOM-hoz hozzáadjuk azt a HTML-t, amit a template-ben határoztunk meg. */
    shadowRoot.append(helloWorldElementTemplate.content.cloneNode(true));
  }
}

customElements.define("hello-world", HelloWorldElement);
