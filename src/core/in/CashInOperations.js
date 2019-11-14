const CashOperations = require('../CashOperations');

class CashInOperations extends CashOperations {
  selectProcessorBy() {
    return 'default';
  }
}

module.exports = CashInOperations;
