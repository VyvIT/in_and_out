const WeeklyLimitCashOutRegistry = require('./WeeklyLimitCashOutRegistry');

describe('WeeklyLimitCashOutRegistry', () => {
  const weekLimit = 1000;

  it('should return 0 taxable amount when limit not reached', () => {
    const registry = new WeeklyLimitCashOutRegistry(weekLimit);
    registry.track(1, 500, '2019-11-01');

    expect(registry.getTaxableAmount()).toEqual(0);
  });

  it('should return exceeded taxable amount when limit was reached', () => {
    const userId = 1;
    const lastOperationAmount = 600;
    const registry = new WeeklyLimitCashOutRegistry(weekLimit);
    registry.track(userId, 500, '2019-11-01');
    registry.track(userId, lastOperationAmount, '2019-11-02');

    expect(registry.getTaxableAmount(userId, lastOperationAmount)).toEqual(100);
  });

  it('should return 0 taxable amount when limit was reached, but next operation is on different week', () => {
    const userId = 1;
    const operationAmountWeek44 = 600;
    const operationAmountWeek45 = 800;
    const registry = new WeeklyLimitCashOutRegistry(weekLimit);
    registry.track(userId, 500, '2019-11-01');
    registry.track(userId, operationAmountWeek44, '2019-11-01');

    expect(registry.getTaxableAmount(userId, operationAmountWeek44)).toEqual(100);
    registry.track(userId, operationAmountWeek45, '2019-11-10');
    expect(registry.getTaxableAmount(userId, operationAmountWeek44)).toEqual(0);
  });

  it('should return different taxable amounts for different users', () => {
    const registry = new WeeklyLimitCashOutRegistry(weekLimit);
    const user1Id = 1;
    const user1OperationAmount = 1500;
    const user2Id = 2;
    const user2OperationAmount = 1600;
    registry.track(user1Id, user1OperationAmount, '2019-11-01');
    registry.track(user2Id, user2OperationAmount, '2019-11-01');

    expect(registry.getTaxableAmount(user1Id, user1OperationAmount)).toEqual(500);
    expect(registry.getTaxableAmount(user2Id, user2OperationAmount)).toEqual(600);
  });
});
