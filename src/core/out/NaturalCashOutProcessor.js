const { percentage } = require('../../utils/money');
const WeeklyLimitCashOutRegistry = require('./WeeklyLimitCashOutRegistry');

class NaturalCashOutProcessor {
  constructor({ fee, weekLimit, currency }) {
    this.cashOutRegistry = new WeeklyLimitCashOutRegistry(weekLimit);
    this.fee = fee;
    this.currency = currency;
  }

  // eslint-disable-next-line camelcase
  process({ user_id, operation: { amount, currency }, date }) {
    this.cashOutRegistry.track(user_id, amount, date);
    const commission = percentage(
      this.cashOutRegistry.getTaxableAmount(user_id, amount), this.fee,
      currency,
    );
    return { amount: commission, currency };
  }
}

module.exports = NaturalCashOutProcessor;
