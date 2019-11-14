const BaseConfigLoader = require('./BaseConfigLoader');

class CashOutNaturalConfigLoader extends BaseConfigLoader {
  validate(config) {
    let percents;
    let amount;
    try {
      ({ percents, week_limit: { amount } } = config);
    } catch (e) {
      throw new Error(`Unable to destructure ${this.name} configuration`);
    }
    if (!Number.isFinite(percents) || !Number.isFinite(amount)) {
      throw new Error(`Invalid ${this.name} configuration`);
    }
  }

  parseConfig(config) {
    const { percents: fee, week_limit: { amount: weekLimit, currency } } = config;
    return { fee, weekLimit, currency };
  }
}

module.exports = CashOutNaturalConfigLoader;
