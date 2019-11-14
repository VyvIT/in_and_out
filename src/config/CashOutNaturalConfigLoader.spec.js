const CashOutNaturalConfigLoader = require('./CashOutNaturalConfigLoader');

describe('CashOutNaturalConfigLoader', () => {
  const testUrl = 'http://www.example.com/cash-out/natural';
  const testName = 'Cash Out Natural Config loader';
  const percents = 0.3;
  const weekLimit = 1000;
  const currency = 'EUR';
  const validConfig = {
    percents,
    week_limit: {
      amount: weekLimit,
      currency,
    },
  };

  describe('when validate is called', () => {
    it('should accept valid cash in config', () => {
      const loader = new CashOutNaturalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(validConfig);
      }).not.toThrow();
    });

    it('should throw in case of invalid config structure', () => {
      const invalidConfig = {
        percents: 0.3,
      };
      const loader = new CashOutNaturalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Unable to destructure ${testName} configuration`);
    });

    it('should throw in case of invalid config values', () => {
      const invalidConfig = {
        percents: null,
        week_limit: {
          amount: null,
          currency: 'EUR',
        },
      };
      const loader = new CashOutNaturalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Invalid ${testName} configuration`);
    });
  });

  describe('when config parsing is done', () => {
    it('should return config', () => {
      const loader = new CashOutNaturalConfigLoader(testName, testUrl);
      expect(loader.parseConfig(validConfig)).toEqual({ fee: percents, weekLimit, currency });
    });
  });
});
