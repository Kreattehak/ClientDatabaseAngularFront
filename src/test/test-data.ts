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
}
