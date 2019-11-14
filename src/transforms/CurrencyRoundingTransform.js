const { Transform } = require('stream');

class CurrencyRoundingTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform({ amount, ...rest }, encoding, callback) {
    const roundedAmount = Math.ceil(amount * 100) / 100;
    callback(null, { amount: roundedAmount, ...rest });
  }
}

module.exports = CurrencyRoundingTransform;
