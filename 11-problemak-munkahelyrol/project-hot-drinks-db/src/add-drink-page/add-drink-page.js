document.addEventListener('readystatechange', () => {
  if (document.readyState !== 'complete') {
    return;
  }

  const statusSelect = document.getElementById('status');
  const likedContainer = document.querySelector('.form-field-container:has(#liked)');
  statusSelect.addEventListener('change', () => {
    likedContainer.style.visibility = statusSelect.value === 'tasted' ? 'visible' : 'hidden';
  });

  const formElement = document.querySelector('form');
  formElement.onsubmit = onFormSubmit;

  function onFormSubmit(event) {
    event.preventDefault();

    const formValue = getFormValue();
    const validationErrors = getValidationErrors(formValue);
    if (validationErrors.length === 0) {
      createDrink(formValue);
    } else {
      validationErrors.forEach(error => {
        document.getElementById(error.id).setCustomValidity(error.message);
      });
    }
  }

  function getFormValue() {
    const inputs = formElement.querySelectorAll('.form-field-container :is(input, select)');

    const formValue = {};
    inputs.forEach(input => {
      let value = input.value || null;
      if (input.type === 'checkbox') {
        value = input.checked;
      }
      formValue[input.id] = value;
    });

    return formValue;
  }

  function getValidationErrors(formValue) {
    const errors = [];

    if (!formValue.name) {
      errors.push({ id: 'name', message: 'The name is required!' });
    }

    return errors;
  }

  let creationPending = false;

  function createDrink(formValue) {
    if (creationPending) {
      return;
    }

    creationPending = true;
    DrinksService.getInstance()
      .createDrink(formValue)
      .subscribe(success => {
        creationPending = false;

        if (success) {
          navigateWithHref('drinks-overview-page/drinks-overview-page.html');
        } else {
          console.error(`There is already a drink existing with the name "${formValue['name']}"!`);
        }
      });
  }
});
