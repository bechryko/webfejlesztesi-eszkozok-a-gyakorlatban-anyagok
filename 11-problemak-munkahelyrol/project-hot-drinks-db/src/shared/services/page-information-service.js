class PageInformationService {
  static #instance;

  pageName;

  static register(pageName) {
    if (this.#instance) {
      throw new Error('PageInformationService instance already exists!');
    }
    this.#instance = new PageInformationService();
    Object.defineProperty(this.#instance, 'pageName', {
      value: pageName,
      writable: false
    });
  }

  static getInstance() {
    if (!this.#instance) {
      throw new Error("PageInformationService instance doesn't exist!");
    }
    return this.#instance;
  }
}
