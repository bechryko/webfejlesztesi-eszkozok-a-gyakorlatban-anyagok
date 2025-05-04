class DrinksService {
  static #OBJECT_STORE_NAME = 'drinks';

  static #instance;

  #indexedDbHandler;
  #updateDrinks$;
  drinks$;

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DrinksService();
    }
    return this.#instance;
  }

  constructor() {
    this.#indexedDbHandler = IndexedDbHandler.getInstance();

    this.#updateDrinks$ = new rxjs.BehaviorSubject(null);
    this.drinks$ = this.#updateDrinks$.pipe(
      rxjs.switchMap(() => this.#indexedDbHandler.listObjectStore(DrinksService.#OBJECT_STORE_NAME)),
      rxjs.shareReplay(1)
    );
  }

  createDrink(drink) {
    return this.drinks$.pipe(
      rxjs.take(1),
      rxjs.switchMap(drinks => {
        const drinkNames = drinks.map(drink => drink.name);

        if (!drinkNames.includes(drink.name)) {
          return this.#indexedDbHandler.addObjectsToStore(DrinksService.#OBJECT_STORE_NAME, [drink]).pipe(
            rxjs.map(() => true),
            rxjs.tap(() => this.#updateDrinks$.next())
          );
        }
        return rxjs.of(false);
      })
    );
  }

  deleteDrink(drink) {
    this.#indexedDbHandler
      .getPrimaryKeyForObject(DrinksService.#OBJECT_STORE_NAME, 'name', drink.name)
      .pipe(
        rxjs.switchMap(index => this.#indexedDbHandler.deleteObjectInStore(DrinksService.#OBJECT_STORE_NAME, index))
      )
      .subscribe(() => this.#updateDrinks$.next());
  }
}
