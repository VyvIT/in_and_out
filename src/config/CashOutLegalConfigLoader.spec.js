const CashOutLegalConfigLoader = require('./CashOutLegalConfigLoader');

describe('CashOutLegalConfigLoader', () => {
  const testUrl = 'http://www.example.com/cash-out/legal';
  const testName = 'Cash Out Legal Config loader';
  const percents = 0.3;
  const minAmount = 0.5;
  const currency = 'EUR';
  const validConfig = {
    percents,
    min: {
      amount: minAmount,
      currency,
    },
  };

  describe('when validate is called', () => {
    it('should accept valid cash in config', () => {
      const loader = new CashOutLegalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(validConfig);
      }).not.toThrow();
    });

    it('should throw in case of invalid config structure', () => {
      const invalidConfig = {
        percents: 0.03,
      };
      const loader = new CashOutLegalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Unable to destructure ${testName} configuration`);
    });

    it('should throw in case of invalid config values', () => {
      const invalidConfig = {
        percents: null,
        min: {
          amount: null,
          currency: 'EUR',
        },
      };
      const loader = new CashOutLegalConfigLoader(testName, testUrl);
      expect(() => {
        loader.validate(invalidConfig);
      }).toThrow(`Invalid ${testName} configuration`);
    });
  });

  describe('when config parsing is done', () => {
    it('should return config', () => {
      const loader = new CashOutLegalConfigLoader(testName, testUrl);
      expect(loader.parseConfig(validConfig)).toEqual({ fee: percents, minAmount, currency });
    });
  });
});
