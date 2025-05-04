document.addEventListener('readystatechange', () => {
  if (document.readyState !== 'complete') {
    return;
  }

  const drinksService = DrinksService.getInstance();

  const container = document.getElementById('drinks-container');

  const searchField = document.getElementById('search-field');
  const searchQuery$ = new rxjs.BehaviorSubject('');
  searchField.addEventListener('input', () => searchQuery$.next(searchField.value));

  drinksService.drinks$
    .pipe(rxjs.switchMap(drinks => searchQuery$.pipe(rxjs.map(query => getFilteredDrinks(drinks, query)))))
    .subscribe(filteredDrinks => {
      removeAllChildren(container);

      filteredDrinks
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(drink => {
          const child = createChild(container, 'hddb-drink-tile');
          child.setAttribute('drink-data', JSON.stringify(drink));
        });
    });
});

function removeAllChildren(parent) {
  Array.from(parent.children).forEach(child => parent.removeChild(child));
}

function getFilteredDrinks(drinks, query) {
  return drinks.filter(drink => {
    if (drink.name.includes(query)) {
      return true;
    }
    return false;
  });
}
