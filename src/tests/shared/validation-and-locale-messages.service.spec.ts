import {ValidationAndLocaleMessagesService} from '../../app/shared/validation-and-locale-messages.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

const form = new FormGroup({
  id: new FormControl(''),
  firstName: new FormControl('', [Validators.required, Validators.minLength(3)])
});
const formErrors = {firstName: ''};

describe('ValidationAndLocaleMessagesService', () => {

  let service: ValidationAndLocaleMessagesService;

  beforeEach(() => {
    service = new ValidationAndLocaleMessagesService('en');
  });

  it('should add cookie to document', () => {
    service.setCookie();

    expect(document.cookie).toBe('myLocaleCookie=en');
  });

  it('should get english validation message', () => {
    const validationMessage: ValidationMessage = service.getLocalizedValidationMessages('firstName');

    expect(validationMessage.required).toContain('First name');
  });

  it('should get polish validation message', () => {
    service.localeId = 'pl';

    const validationMessage: ValidationMessage = service.getLocalizedValidationMessages('firstName');

    expect(validationMessage.required).toContain('Imię');
  });

  it('should get english message', () => {
    const validationMessage = service.getLocalizedMessages('errorTitle');

    expect(validationMessage).toContain('Error');
  });

  it('should get polish message', () => {
    service.localeId = 'pl';

    const validationMessage = service.getLocalizedMessages('errorTitle');

    expect(validationMessage).toContain('Błąd');
  });

  it('should not validate form and return early when form is null', () => {
    setUpErrorOnControl();
    service.onValueChanged(null, formErrors);

    expect(formErrors.firstName).not.toContain('is required');
  });

  it('should validate form', () => {
    setUpErrorOnControl();

    service.onValueChanged(form, formErrors);

    expect(formErrors.firstName).toContain('is required');
  });

  function setUpErrorOnControl() {
    const control = form.get('firstName');
    control.markAsDirty();
    control.markAsTouched();
    control.setErrors({
      required: true
    });
  }
});

interface ValidationMessage {
  [key: string]: string;
}
