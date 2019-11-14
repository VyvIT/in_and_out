/* eslint-disable no-underscore-dangle */
const CurrencyFormatTransform = require('./CurrencyFormatTransform');

describe('CurrencyFormatTransform', () => {
  it('should return formatted numbers', () => {
    const transform = new CurrencyFormatTransform();
    const spyCallback = jest.fn();

    transform._transform({ amount: 0 }, 'fake-enc', spyCallback);
    expect(spyCallback).toHaveBeenCalledWith(null, '0.00');

    transform._transform({ amount: 0.2 }, 'fake-enc', spyCallback);
    expect(spyCallback).toHaveBeenCalledWith(null, '0.20');

    transform._transform({ amount: 87 }, 'fake-enc', spyCallback);
    expect(spyCallback).toHaveBeenCalledWith(null, '87.00');
  });
});
