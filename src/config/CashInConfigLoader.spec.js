const CashInConfigLoader = require('./CashInConfigLoader');

describe('CashInConfigLoader', () => {
  const testUrl = 'http://www.example.com/cash-in';
  const testName = 'Cash In Config loader';
  const percents = 0.03;
  const maxAmount = 5;
  const currency = 'EUR';
  const validConfig = {
    percents,
    max: {
      amount: maxAmount,
      currency,
    },
  };

  describe('when validate is called', () => {
    it('should accept valid cash in config', () => {
      const loader = new CashInConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(validConfig);
      }).not.toThrow();
    });

    it('should throw in case of invalid config structure', () => {
      const invalidConfig = {
        percents: 0.03,
      };
      const loader = new CashInConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Unable to destructure ${testName} configuration`);
    });

    it('should throw in case of invalid config values', () => {
      const invalidConfig = {
        percents: null,
        max: {
          amount: null,
          currency: 'EUR',
        },
      };
      const loader = new CashInConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Invalid ${testName} configuration`);
    });

    it('should throw in case amount is not valid', () => {
      const invalidConfig = {
        percents,
        max: {
          amount: 0,
          currency: 'EUR',
        },
      };
      const loader = new CashInConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Invalid ${testName} configuration`);
    });
  });

  describe('when config parsing is done', () => {
    it('should return config', () => {
      const loader = new CashInConfigLoader(testName, testUrl);
      expect(loader.parseConfig(validConfig)).toEqual({ fee: percents, maxAmount, currency });
    });
  });
});
