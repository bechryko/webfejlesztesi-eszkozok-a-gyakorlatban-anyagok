/* Ahhoz, hogy saját HTML elemet csináljunk, egy új JavaScript osztályt kell létrehozni, ami
öröklődik a HTMLElement osztályból. */
class HelloWorldElement extends HTMLElement {
  constructor() {
    /* Saját HTML elemek esetében elsőnek meg kell hívni az ősosztály konstruktorát. */
    super();

    /* Be lehet állítani az aktuális (<hello-world></hello-world>) elem belső HTML-jét, azaz ami
    majd megjelenjen a DOM-on. (Ez ebben a formában csak akkor működik, ha a HTML-en ez a script
    a "defer" attribútummal van ellátva.) */
    this.innerHTML = `
      <p>Hello World!</p>
    `;

    /* Úgy is lehet létrehozni új elemet, ha a "document" globális objektum "createElement"
    metódusát használjuk, paraméterben a létrehozandó elem nevével (szelektor). */
    const styles = document.createElement("style");
    /* Style-nál nem innerHTML-t kell használni (nem HTML-t írunk), hanem szöveges tartalmat. */
    styles.textContent = `
      hello-world {
        display: block;
        padding: 2rem;
        margin: auto;
        font-size: 2rem;
        border: 1px solid black;
        border-radius: 1.5rem;
        width: fit-content;
        height: fit-content;
      }

      p {
        margin: 0;
        text-align: center;
        width: fit-content;
        user-select: none;
      }
    `;
    /* Hozzáadjuk a saját elemünk tartalmához az új style elemet. */
    this.append(styles);

    /* Azt is meg lehet adni, hogy az elemünkre való kattintáskor mi történjen. */
    this.addEventListener("click", () => {
      this.swapBackgroundColor();
    });
  }

  swapBackgroundColor() {
    /* JavaScript-ben az elemek stílusát is lehet módosítani, mintha CSS-t változtatnánk. */
    this.style.backgroundColor = this.style.backgroundColor === "lime" ? "green" : "lime";
  }
}

/* Ezzel a sorral mondjuk meg, hogy a <hello-world></hello-world> tag-et szeretnénk összekötni
azzal a JavaScript osztállyal, amit most írtunk meg. Fontos, hogy a HTML elem nevében (első
paraméter) kötelező egy kötőjelnek szerepelnie! */
customElements.define("hello-world", HelloWorldElement);
