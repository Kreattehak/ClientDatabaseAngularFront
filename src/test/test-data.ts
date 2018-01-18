import {Address} from '../app/addresses/address';

export class TestData {
  static _ADDRESS_DATA: Address = {
    id: 1,
    streetName: 'street',
    cityName: 'city',
    zipCode: '44-444'
  };
  static _CLIENT_FORM_DATA = {
    id: 1,
    firstName: 'Fake',
    lastName: 'User',
  };
  static _CLIENT_DATA = {
    id: 1,
    firstName: 'Fake',
    lastName: 'User',
    dateOfRegistration: '11-05-1974',
    mainAddress: null
  };
  static _CLIENT_FORM_ERRORS = {
    firstName: 'usernameError',
    lastName: 'passwordError'
  };
  static _LOGIN_FORM_ERRORS = {
    username: 'usernameError',
    password: 'passwordError'
  };
  static _ADDRESS_FORM_ERRORS = {
    streetName: 'streetNameError',
    cityName: 'cityNameError',
    zipCode: 'zipCodeError'
  };

  static get CLIENT_DATA() {
    return {
      ...TestData._CLIENT_DATA,
      mainAddress: {...TestData.ADDRESS_DATA}
    };
  }

  static get ADDRESS_DATA() {
    return {...TestData._ADDRESS_DATA};
  }

  static get CLIENT_FORM_DATA() {
    return {...TestData._CLIENT_FORM_DATA};
  }

  static get CLIENT_FORM_ERRORS() {
    return {...TestData._CLIENT_FORM_ERRORS};
  }

  static get LOGIN_FORM_ERRORS() {
    return {...TestData._LOGIN_FORM_ERRORS};
  }

  static get ADDRESS_FORM_ERRORS() {
    return {...TestData._ADDRESS_FORM_ERRORS};
  }
}
