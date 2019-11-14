const NaturalCashOutProcessor = require('./NaturalCashOutProcessor');

describe('NaturalCashOutProcessor', () => {
  const weekLimit = 1000;
  const currency = 'EUR';

  it('should calculate 0 commission in case limit not reached', () => {
    const processor = new NaturalCashOutProcessor({ weekLimit, fee: 0.3, currency });
    const dataItem = { user_id: '1', operation: { amount: 500, currency }, date: '2019-11-01' };

    const result = processor.process(dataItem);

    expect(result.amount).toEqual(0);
  });

  it('should calculate 0 commission in case operations were done on different weeks', () => {
    const processor = new NaturalCashOutProcessor({ weekLimit, fee: 0.3, currency });
    const dataItem1 = { user_id: '1', operation: { amount: 1200, currency }, date: '2019-11-01' };
    const dataItem2 = { user_id: '1', operation: { amount: 200, currency }, date: '2019-11-10' };

    const week44Commission = processor.process(dataItem1);
    const week45Commission = processor.process(dataItem2);

    expect(week44Commission.amount).toEqual(0.6);
    expect(week45Commission.amount).toEqual(0);
  });

  it('should calculate 0 commission in case operations are for different users', () => {
    const processor = new NaturalCashOutProcessor({ weekLimit, fee: 0.3, currency });
    const dataItem1 = { user_id: '1', operation: { amount: 20000, currency }, date: '2019-11-01' };
    const dataItem2 = { user_id: '2', operation: { amount: 200, currency }, date: '2019-11-02' };

    const user1Commission = processor.process(dataItem1);
    const user2Commission = processor.process(dataItem2);

    expect(user1Commission.amount).toEqual(57);
    expect(user2Commission.amount).toEqual(0);
  });

  it('should calculate 0 commission in case limit equals week limit', () => {
    const processor = new NaturalCashOutProcessor({ weekLimit, fee: 0.3, currency });
    const dataItem1 = { user_id: '1', operation: { amount: 600, currency }, date: '2019-11-01' };
    const dataItem2 = { user_id: '1', operation: { amount: 200, currency }, date: '2019-11-02' };
    const dataItem3 = { user_id: '1', operation: { amount: 200, currency }, date: '2019-11-02' };

    processor.process(dataItem1);
    processor.process(dataItem2);
    const result = processor.process(dataItem3);

    expect(result.amount).toEqual(0);
  });

  it('should calculate commission when week limit is reached', () => {
    const processor = new NaturalCashOutProcessor({ weekLimit, fee: 0.3, currency });
    const dataItem1 = { user_id: '1', operation: { amount: 500, currency }, date: '2019-11-01' };
    const dataItem2 = { user_id: '1', operation: { amount: 700, currency }, date: '2019-11-02' };
    const dataItem3 = { user_id: '1', operation: { amount: 100, currency }, date: '2019-11-03' };

    processor.process(dataItem1);
    processor.process(dataItem2);
    const result = processor.process(dataItem3);

    expect(result.amount).toEqual(0.3);
  });
});
