const CashOperations = require('../CashOperations');

class CashOutOperations extends CashOperations {
  selectProcessorBy(data) {
    return data.user_type;
  }
}

module.exports = CashOutOperations;
