// 輸入欄位預設值（依 REQUIREMENTS.md 第二章）
export const DEFAULT_INPUTS = {
  // 2.1 房屋與貸款
  housePrice: 1800,            // 房屋總價（萬）
  loanRatio: 80,               // 貸款成數（%）
  qingAnLimit: 1500,           // 新青安額度上限（萬） (預設改為 2.0)
  qingAnRate: 2.185,           // 新青安利率（%） (預設改為 2.0)
  excessRate: 2.25,           // 超額部分利率（%）
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

// 新青安方案預設（可擴充／更新為實際公告數值）
export const QINGAN_PRESETS = {
  '1.0': { qingAnRate: 1.775, qingAnLimit: 1000 },
  // 範例：2.0 有逐步退場模擬設定（示意用，實際以公告為準）
  '2.0': {
    qingAnRate: 2.185,
    qingAnLimit: 1500,
    // phasedSchedule: 逐段指定年數與該段的優惠年利率（%）
    // 例如：前 2 年 1.5%，接著 2 年 1.9%，之後回到基準 2.185%
    phasedSchedule: [
      { years: 2, rate: 1.5 },
      { years: 2, rate: 1.9 },
    ],
  },
};

// 將預設方案名稱加入 DEFAULT_INPUTS 以供表單儲存（預設改為 2.0）
DEFAULT_INPUTS.qingAnPreset = '2.0';
