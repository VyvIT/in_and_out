const BaseConfigLoader = require('./BaseConfigLoader');

class CashOutLegalConfigLoader extends BaseConfigLoader {
  validate(config) {
    let percents;
    let amount;
    try {
      ({ percents, min: { amount } } = config);
    } catch (e) {
      throw new Error(`Unable to destructure ${this.name} configuration`);
    }
    if (!Number.isFinite(percents) || !Number.isFinite(amount)) {
      throw new Error(`Invalid ${this.name} configuration`);
    }
  }

  parseConfig(config) {
    const { percents: fee, min: { amount: minAmount, currency } } = config;
    return { fee, minAmount, currency };
  }
}

module.exports = CashOutLegalConfigLoader;
