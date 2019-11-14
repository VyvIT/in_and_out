const DefaultCashInProcessor = require('./DefaultCashInProcessor');

describe('DefaultCashInProcessor', () => {
  const maxAmount = 5;
  const currency = 'EUR';

  it('should return max amount value in case commission is higher than max amount', () => {
    const processor = new DefaultCashInProcessor({ maxAmount, fee: 50, currency });
    const dataItem = { operation: { amount: 120, currency } };

    const result = processor.process(dataItem);

    expect(result.amount).toEqual(maxAmount);
  });

  it('should return commission value equal to 0, if fee is 0%', () => {
    const processor = new DefaultCashInProcessor({ maxAmount, fee: 0, currency });
    const dataItem = { operation: { amount: 120, currency } };
    const result = processor.process(dataItem);

    expect(result.amount).toEqual(0);
  });

  it('should return calculated commission value', () => {
    const processor = new DefaultCashInProcessor({ maxAmount, fee: 0.5, currency });
    const dataItem = { operation: { amount: 120, currency } };
    const result = processor.process(dataItem);

    expect(result.amount).toEqual(0.6);
  });
});
