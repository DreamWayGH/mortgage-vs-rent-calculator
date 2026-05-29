// 輸入欄位預設值（依 REQUIREMENTS.md 第二章）
export const DEFAULT_INPUTS = {
  // 2.1 房屋與貸款
  housePrice: 1800,            // 房屋總價（萬）
  loanRatio: 80,               // 貸款成數（%）
  qingAnLimit: 1000,           // 新青安額度上限（萬）
  qingAnRate: 1.775,           // 新青安利率（%）
  excessRate: 2.185,           // 超額部分利率（%）
  loanYears: 40,               // 貸款年限（年）
  gracePeriodYears: 5,         // 寬限期（年）
  monthlyHoldingCost: 2000,    // 每月持有成本（元）：房屋稅、地價稅、管理費、維修費月均攤

  // 2.2 租房方案
  monthlyRent: 30000,          // 月租金（元）
  rentGrowthRate: 1,           // 租金年漲幅（%）

  // 2.3 投資假設
  etfReturnRate: 5,            // ETF 年化報酬率（%）

  // 2.4 增值假設
  housePriceGrowthRate: 2,     // 房價年漲幅（%）
};
