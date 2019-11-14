const { weekNumberYear } = require('weeknumber');

class WeeklyLimitCashOutRegistry {
  constructor(weekLimit) {
    this.weekLimit = weekLimit;
    this.weeklyAmountByUserId = {};
    this.weekNumber = 0;
  }

  track(userId, amount, date) {
    const currentWeekNumber = weekNumberYear(date).week;
    if (!this.weeklyAmountByUserId[userId] || currentWeekNumber !== this.weekNumber) {
      this.weeklyAmountByUserId[userId] = 0;
      this.weekNumber = currentWeekNumber;
    }
    this.weeklyAmountByUserId[userId] += amount;
  }

  isLimitReached(userId) {
    return this.getTotal(userId) > this.weekLimit;
  }

  getTaxableAmount(userId, amount) {
    if (this.isLimitReached(userId)) {
      return Math.min(this.getTotal(userId) - this.weekLimit, amount);
    }
    return 0;
  }

  getTotal(id) {
    return this.weeklyAmountByUserId[id] || 0;
  }
}

module.exports = WeeklyLimitCashOutRegistry;
