import {Inject, Injectable, LOCALE_ID} from '@angular/core';

@Injectable()
export class ValidationService {
  public validationMessages = {
    en: {
      'firstName': {
        'required': 'First name is required.',
        'minlength': 'First name must be at least 3 characters long.',
      },
      'lastName': {
        'required': 'Last name is required.',
        'minlength': 'Last name must be at least 3 characters long.',
      },
      'streetName': {
        'required': 'Street name is required.',
        'minlength': 'Street name must be at least 3 characters long.',
      },
      'cityName': {
        'required': 'City name is required.',
        'minlength': 'City name must be at least 3 characters long.',
      },
      'zipCode': {
        'required': 'Zipcode is required.',
        'minlength': 'Zipcode can\'t have less values than 6.',
        'maxlength': 'Zipcode can\'t have more values than 6.',
        'pattern': 'ZipCode value inserted is not valid',
      },
      'username': {
        'required': 'Username is required.',
        'minlength': 'Username must be at least 3 characters long.',
      },
      'password': {
        'required': 'Password is required.',
      },
    },
    pl: {
      'firstName': {
        'required': 'Imię klienta jest wymagane.',
        'minlength': 'Imię klienta musi mieć długość conajmniej 3 znaków.',
      },
      'lastName': {
        'required': 'Nazwisko klienta jest wymagane.',
        'minlength': 'Nazwisko klienta musi mieć długość conajmniej 3 znaków.',
      },
      'streetName': {
        'required': 'Nazwa ulicy jest wymagana.',
        'minlength': 'Nazwa ulicy musi mieć długość conajmniej 3 znaków.',
      },
      'cityName': {
        'required': 'Nazwa miasta jest wymagana.',
        'minlength': 'Nazwa miasta musi mieć długość conajmniej 3 znaków.',
      },
      'zipCode': {
        'required': 'Kod pocztowy jest wymagany.',
        'minlength': 'Kod pocztowy musi mieć dokładnie 6 znaków (11-111).',
        'maxlength': 'Kod pocztowy musi mieć dokładnie 6 znaków (11-111).',
        'pattern': 'Podany kod pocztowy jest nieprawidłowy.',
      },
      'username': {
        'required': 'Nazwa użytkownika jest wymagana.',
        'minlength': 'Nazwa użytkownika musi mieć długość conajmniej 3 znaków.',
      },
      'password': {
        'required': 'Hasło jest wymagane.',
      },
    }
  };

  constructor(@Inject(LOCALE_ID) public localeId: string) {
  }

  public getLocalizedValidationMessages(field: any) {
    return this.validationMessages[this.localeId][field];
  }
}
