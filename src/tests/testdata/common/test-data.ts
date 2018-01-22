import {Address} from '../../../app/addresses/address';
import {Client} from '../../../app/clients/client';

export class TestData {
  static _ADDRESS_DATA: Address = {
    id: 1,
    streetName: 'street',
    cityName: 'city',
    zipCode: '44-444'
  };
  static _CLIENT_FORM_DATA: ClientFormData = {
    id: 1,
    firstName: 'Fake',
    lastName: 'User',
  };
  static _CLIENT_DATA: Client = {
    id: 1,
    firstName: 'Fake',
    lastName: 'User',
    dateOfRegistration: '11-05-1974',
    mainAddress: null
  };
  static _CLIENT_FORM_ERRORS: ClientFormErrors = {
    firstName: 'usernameError',
    lastName: 'passwordError'
  };
  static _LOGIN_FORM_ERRORS: LoginFormErrors = {
    username: 'usernameError',
    password: 'passwordError'
  };
  static _ADDRESS_FORM_ERRORS: AddressFormErrors = {
    streetName: 'streetNameError',
    cityName: 'cityNameError',
    zipCode: 'zipCodeError'
  };

  static get CLIENT_DATA(): Client {
    return <Client>{
      ...TestData._CLIENT_DATA,
      mainAddress: {...TestData.ADDRESS_DATA}
    };
  }

  static get ADDRESS_DATA(): Address {
    return <Address>{...TestData._ADDRESS_DATA};
  }

  static get CLIENT_FORM_DATA(): ClientFormData {
    return <ClientFormData>{...TestData._CLIENT_FORM_DATA};
  }

  static get CLIENT_FORM_ERRORS(): ClientFormErrors {
    return <ClientFormErrors>{...TestData._CLIENT_FORM_ERRORS};
  }

  static get LOGIN_FORM_ERRORS(): LoginFormErrors {
    return <LoginFormErrors>{...TestData._LOGIN_FORM_ERRORS};
  }

  static get ADDRESS_FORM_ERRORS(): AddressFormErrors {
    return <AddressFormErrors>{...TestData._ADDRESS_FORM_ERRORS};
  }
}

interface ClientFormData {
  id: number;
  firstName: string;
  lastName: string;
}

interface ClientFormErrors {
  firstName: string;
  lastName: string;
}

interface LoginFormErrors {
  username: string;
  password: string;
}

interface AddressFormErrors {
  cityName: string;
  streetName: string;
  zipCode: string;
}
