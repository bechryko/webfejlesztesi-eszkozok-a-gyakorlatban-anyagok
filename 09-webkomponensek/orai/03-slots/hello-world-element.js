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

    span {
      color: brown;
    }

    /* A ::slotted pszeudo-elem azokra az elemekre tud stílust adni, amik egy slot-on keresztül
    jelennek meg saját HTML elemünkben. Paraméterben egy szelektort kell megadni, ezekre a slotted
    elemekre lesznek érvényesek a stílusok. */
    ::slotted(span) {
      color: purple;
    }

    ::slotted(:not(span)) {
      display: none;
    }
  </style>

  <!-- A slot elemet saját HTML elemekben lehet használni, a "name" attribútuma hasonlóan működik,
    mint az input elemeknél. HTML-en így tudunk kívülről beadni elemeket saját HTML elemünkbe.
    Alapértelmezett HTML-t meg lehet adni a slot-on belül is, arra az esetre, ha nem adnának be
    kívülről értéket a slot-nak. -->
  <p>Hello <slot name="name"><span>World<span></slot>!</p>
`;

class HelloWorldElement extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.append(helloWorldElementTemplate.content.cloneNode(true));
  }
}

customElements.define("hello-world", HelloWorldElement);
