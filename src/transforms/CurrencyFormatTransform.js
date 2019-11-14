const { Transform } = require('stream');

class CurrencyFormatTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform({ amount }, encoding, callback) {
    callback(null, amount.toFixed(2));
  }
}

module.exports = CurrencyFormatTransform;
