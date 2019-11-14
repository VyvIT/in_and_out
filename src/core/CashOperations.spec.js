const CashOperations = require('./CashOperations');

describe('CashOperations', () => {
  const processorName = 'TestProcessor';
  const invalidProcessor = {};

  it('should throw in case cash operation processor does not implement process function', () => {
    const operations = new CashOperations();
    expect(() => {
      operations.add(processorName, invalidProcessor);
    }).toThrow(`Cash operation processor ${processorName} must implement a process function`);
  });

  it('should register a cash operation processor', () => {
    const operations = new CashOperations();
    const validProcessor = {
      process: () => {
      },
    };
    operations.add(processorName, validProcessor);
    expect(operations.getProcessor(processorName)).toEqual(validProcessor);
  });

  it('should delegate the correct processor to handle provided data for the processing', () => {
    const cashOutDataItem = { type: 'cash-out' };
    const operations = new CashOperations();

    const processorName1 = 'cash-in';
    const validProcessor1 = {
      process: () => {
      },
    };

    const processorName2 = 'cash-out';
    const processSpy = jest.fn();
    const validProcessor2 = {
      process: processSpy,
    };
    operations.add(processorName1, validProcessor1);
    operations.add(processorName2, validProcessor2);

    operations.process(cashOutDataItem);

    expect(processSpy).toHaveBeenCalledWith(cashOutDataItem);
    // expect(operations.getProcessor(processorName)).toEqual(validProcessor);
  });

  it('should throw if processor to handle provided data is not found', () => {
    const cashOutDataItem = { type: 'cash-out' };
    const operations = new CashOperations();

    expect(() => {
      operations.process(cashOutDataItem);
    }).toThrow('Unable to process the data, cash operation processor not found.');
  });
});
