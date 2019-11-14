const { percentage } = require('../../utils/money');

class DefaultCashInProcessor {
  constructor({ maxAmount, fee, currency }) {
    this.fee = fee;
    this.maxAmount = maxAmount;
    this.currency = currency;
  }

  process({ operation: { amount, currency } }) {
    const commission = percentage(amount, this.fee, currency);
    if (commission > this.maxAmount) {
      return { amount: this.maxAmount, currency };
    }
    return { amount: commission, currency };
  }
}

module.exports = DefaultCashInProcessor;
