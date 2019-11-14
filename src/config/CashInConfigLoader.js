const BaseConfigLoader = require('./BaseConfigLoader');

class CashInConfigLoader extends BaseConfigLoader {
  validate(config) {
    let percents;
    let amount;
    try {
      ({ percents, max: { amount } } = config);
    } catch (e) {
      throw new Error(`Unable to destructure ${this.name} configuration`);
    }
    if (!Number.isFinite(percents) || !Number.isFinite(amount) || amount <= 0 || percents < 0) {
      throw new Error(`Invalid ${this.name} configuration`);
    }
  }

  parseConfig(config) {
    const { percents: fee, max: { amount: maxAmount, currency } } = config;
    return { fee, maxAmount, currency };
  }
}

module.exports = CashInConfigLoader;
