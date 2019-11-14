const Dinero = require('dinero.js');

const getExponent = (currency) => {
  const exponents = {
    EUR: 2,
  };
  if (exponents[currency]) {
    return exponents[currency];
  }
  throw new Error('Unknown currency exponent value');
};

const toMoney = (amount, currency) => Dinero({
  amount: amount * 10 ** getExponent(currency),
  currency,
});

const calculatePercentage = (amount, percentage, currency) => toMoney(amount, currency)
  .percentage(percentage)
  .toUnit();

module.exports = {
  percentage: calculatePercentage,
};
