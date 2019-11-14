const CurrencyRoundingTransform = require('./CurrencyRoundingTransform');

describe('CurrencyRoundingTransform', () => {
  it('should return rounded operation amounts', () => {
    const transform = new CurrencyRoundingTransform();
    const spyCallback = jest.fn();
    // eslint-disable-next-line no-underscore-dangle
    transform._transform({ amount: 0.023 }, 'fake-enc', spyCallback);
    expect(spyCallback).toHaveBeenCalledWith(null, { amount: 0.03 });
  });
});
