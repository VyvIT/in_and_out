const { Transform } = require('stream');

class DelegateActionTransform extends Transform {
  constructor(processFn) {
    super({ objectMode: true });
    this.processFn = processFn;
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, callback) {
    callback(null, this.processFn(chunk));
  }
}

module.exports = DelegateActionTransform;
