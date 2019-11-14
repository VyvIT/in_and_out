/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

const CashInConfigLoader = require('./src/config/CashInConfigLoader');
const CashOutNaturalConfigLoader = require('./src/config/CashOutNaturalConfigLoader');
const CashOutLegalConfigLoader = require('./src/config/CashOutLegalConfigLoader');

const CashOperations = require('./src/core/CashOperations');

const CashInOperations = require('./src/core/in/CashInOperations');
const DefaultCashInProcessor = require('./src/core/in/DefaultCashInProcessor');

const CashOutOperations = require('./src/core/out/CashOutOperations');
const NaturalCashOutProcessor = require('./src/core/out/NaturalCashOutProcessor');
const LegalCashOutProcessor = require('./src/core/out/LegalCashOutProcessor');

const DelegateActionTransform = require('./src/transforms/DelegateActionTransform');
const CurrencyRoundingTransform = require('./src/transforms/CurrencyRoundingTransform');
const CurrencyFormatTransform = require('./src/transforms/CurrencyFormatTransform');

const validate = require('./src/core/validate');

const main = async () => {
  if (!process.argv[2]) {
    console.error('JSON file not provided');
    return;
  }
  const fileName = process.argv[2];
  try {
    // checking file access
    await fs.promises.access(fileName, fs.constants.R_OK);
  } catch (e) {
    console.error('Unable to access the provided file:', path.resolve(fileName));
    return;
  }

  // loading commission configurations from the API endpoints
  const cashInConfigLoader = new CashInConfigLoader('Cash in', 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in');
  const naturalCashOutConfigLoader = new CashOutNaturalConfigLoader('Cash out (Natural)', 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural');
  const legalCashOutConfigLoader = new CashOutLegalConfigLoader('Cash out (Legal)', 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical');

  let cashInConfig;
  let naturalCashOutConfig;
  let legalCashOutConfig;
  try {
    ([cashInConfig, naturalCashOutConfig, legalCashOutConfig] = await Promise.all([
      cashInConfigLoader.load(),
      naturalCashOutConfigLoader.load(),
      legalCashOutConfigLoader.load(),
    ]));
  } catch (e) {
    console.error('Failed to load one of configurations', e);
    return;
  }

  const operations = new CashOperations();

  const cashInProcessors = new CashInOperations();
  cashInProcessors.add('default', new DefaultCashInProcessor(cashInConfig));

  const cashOutProcessors = new CashOutOperations();

  // registers operation processors by user type
  cashOutProcessors.add('natural', new NaturalCashOutProcessor(naturalCashOutConfig));
  cashOutProcessors.add('juridical', new LegalCashOutProcessor(legalCashOutConfig));

  // registers operation processors by operation type
  operations.add('cash_in', cashInProcessors);
  operations.add('cash_out', cashOutProcessors);

  fs
    .createReadStream(fileName)
    .pipe(JSONStream.parse('.*'))
    // performs some primitive validation on each data row
    .pipe(new DelegateActionTransform(validate))
    // processes the commission calculation
    .pipe(new DelegateActionTransform(operations.process.bind(operations)))
    // performs rounding operations
    .pipe(new CurrencyRoundingTransform())
    // performs number formatting
    .pipe(new CurrencyFormatTransform())
    .on('data', (data) => {
      console.log(data);
    })
    .on('error', (err) => {
      console.log(err);
    });
};

main().catch((e) => {
  console.error('Something has failed:\n', e);
});
