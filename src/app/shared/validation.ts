export class Validation {
  public static validationMessages = {
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
  };
}
