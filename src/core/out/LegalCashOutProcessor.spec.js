const LegalCashOutProcessor = require('./LegalCashOutProcessor');

describe('LegalCashOutProcessor', () => {
  const minAmount = 0.5;
  const currency = 'EUR';

  it('should return min amount value in case calculated commission is lower than min amount', () => {
    const processor = new LegalCashOutProcessor({ minAmount, fee: 0.1, currency });
    const dataItem = { operation: { amount: 120, currency } };

    const result = processor.process(dataItem);

    expect(result.amount).toEqual(minAmount);
  });

  it('should return commission value equal to min amount, if fee is 0%', () => {
    const processor = new LegalCashOutProcessor({ minAmount, fee: 0, currency });
    const dataItem = { operation: { amount: 120, currency } };
    const result = processor.process(dataItem);

    expect(result.amount).toEqual(minAmount);
  });

  it('should return calculated commission value', () => {
    const processor = new LegalCashOutProcessor({ minAmount, fee: 5, currency });
    const dataItem = { operation: { amount: 120, currency } };
    const result = processor.process(dataItem);

    expect(result.amount).toEqual(6);
  });
});
