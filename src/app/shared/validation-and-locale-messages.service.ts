import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class ValidationAndLocaleMessagesService {
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

  public applicationMessages = {
    en: {
      'addressExists': 'Address already exists!',
      'addressAdded': 'Address was successfully added.',
      'addressNotAdded': 'Address wasn\'t added.',
      'alreadyMainAddress': 'This address is already a main address!',
      'cannotDeleteMainAddress': 'You can\'t delete address that is currently a main address.',
      'removeAddressConfirmTitle': 'Address deletion',
      'removeAddressConfirmMessage': 'Do you want to remove selected address?',

      'clientExists': 'Client already exists!',
      'clientAdded': 'Client was successfully added.',
      'clientNotAdded': 'Client wasn\'t added.',
      'removeClientConfirmTitle': 'Client deletion',
      'removeClientConfirmMessage': 'Do you want to remove selected client?',

      'dataBeingResolved': 'Please wait while data is being resolved.',
      'noMatchForFilter': 'There are no clients that match your filter sentence.',
      'cancelAction': 'Cancel',
      'confirmAction': 'Confirm',
      'rowNotSelected': 'Please select an row.',
      'tokenHasExpired': 'User token has expired! Please login again.',
      'emptyDatabase': 'Server returned empty array, there are no users in database!',
      'serverOffline': 'Server is offline.',
      'errorTitle': 'Error!',
      'successTitle': 'Success!'
    },
    pl: {
      'addressExists': 'Adres już istnieje!',
      'addressAdded': 'Adres został pomyślnie dodany.',
      'addressNotAdded': 'Adres nie został dodany.',
      'alreadyMainAddress': 'Ten adres już jest domyślnym adresem!',
      'cannotDeleteMainAddress': 'Usunięcie domyślnego adresu jest niemożliwe.',
      'removeAddressConfirmTitle': 'Usunięcie adresu',
      'removeAddressConfirmMessage': 'Czy na pewno chcesz usunąć ten adres?',

      'clientExists': 'Klient już istnieje!',
      'clientAdded': 'Klient został pomyślnie dodany.',
      'clientNotAdded': 'Adres nie został dodany.',
      'removeClientConfirmTitle': 'Usunięcie klienta',
      'removeClientConfirmMessage': 'Czy na pewno chcesz usunąć tego klienta?',

      'dataBeingResolved': 'Proszę czekać, dane są pobierane w tle.',
      'noMatchForFilter': 'Nie istnieje żaden klient spełniający kryteria wyszukiwania.',
      'cancelAction': 'Anuluj',
      'confirmAction': 'Kontynuuj',
      'rowNotSelected': 'Proszę wybrać wiersz.',
      'tokenHasExpired': 'Token użytkownika wygasł! Proszę zalogować się ponownie.',
      'errorTitle': 'Błąd!',
      'successTitle': 'Sukces!'
    }
  };

  constructor(@Inject(LOCALE_ID) public localeId: string) {
  }

  public setCookie(): void {
    document.cookie = 'myLocaleCookie=' + this.localeId;
  }

  public getLocalizedValidationMessages(field: any) {
    return this.validationMessages[this.localeId][field];
  }

  public getLocalizedMessages(field: string) {
    return this.applicationMessages[this.localeId][field];
  }

  public onValueChanged(form: FormGroup, formErrors: {}, data ?: any) {
    if (!form) {
      return;
    }
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // check field
        formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.getLocalizedValidationMessages(field);
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
