class QuickActionsService {
  static #instance;

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new QuickActionsService();
    }
    return this.#instance;
  }

  likeDrink(category, name) {
    const drink = {
      name,
      category,
      liked: true,
      status: 'tasted'
    };

    DrinksService.getInstance().createDrink(drink).subscribe();
  }

  dislikeDrink(category, name) {
    const drink = {
      name,
      category,
      liked: false,
      status: 'tasted'
    };

    DrinksService.getInstance().createDrink(drink).subscribe();
  }

  listDrink(category, name) {
    const drink = {
      name,
      category,
      liked: false,
      status: 'to-drink'
    };

    DrinksService.getInstance().createDrink(drink).subscribe();
  }
}
