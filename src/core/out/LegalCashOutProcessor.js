const { percentage } = require('../../utils/money');

class LegalCashOutProcessor {
  constructor({ fee, minAmount, currency }) {
    this.fee = fee;
    this.minAmount = minAmount;
    this.currency = currency;
  }

  process({ operation: { amount, currency } }) {
    const commission = percentage(amount, this.fee, currency);
    if (commission < this.minAmount) {
      return { amount: this.minAmount, currency };
    }
    return { amount: commission, currency };
  }
}

module.exports = LegalCashOutProcessor;
