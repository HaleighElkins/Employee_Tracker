const validator = require('validator');

const validate = {
  validateString: str => str !== '' || 'Please enter a valid response!',
  validateSalary: num => validator.isDecimal(num) || 'Please enter a valid salary!',
  isSame: (str1, str2) => str1 === str2
};

module.exports = validate;
