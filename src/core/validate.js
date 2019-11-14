/* eslint-disable camelcase */

// TODO: use some fancy date validation library
const isValidDate = (date) => date && Number.isInteger(Date.parse(date));

/**
 * Primitive cash operation validation
 */
const validate = (data) => {
  let date;
  let user_id;
  let user_type;
  let operationType;
  let amount;
  let currency;
  try {
    ({
      date, user_id, user_type, type: operationType, operation: { amount, currency },
    } = data);
  } catch (e) {
    throw new Error('Unable to parse operation');
  }

  if (!isValidDate(date)) {
    throw new Error('Invalid field: date');
  }

  if (!Number.isInteger(user_id)) {
    throw new Error('Invalid field: user_id');
  }

  if (!user_type) {
    throw new Error('Invalid field: user_type');
  }

  if (!operationType) {
    throw new Error('Invalid field: type');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid field: amount');
  }

  if (!currency) {
    throw new Error('Invalid field: currency');
  }
  return data;
};

module.exports = validate;
