// 投資與租房相關計算（REQUIREMENTS 3.2）
import { generateMonthlySchedule, calculateMortgage, calculateCapitalGainsTax } from './mortgage';

/**
 * 依年漲幅計算第 N 年（1-based）的月租金
 * 第 1 年 = initialRent，第 2 年 = initialRent * (1+g)，依此類推
 */
export function calculateRentAtYear(initialRent, growthRate, year) {
  return initialRent * Math.pow(1 + growthRate / 100, year - 1);
}

/**
 * 計算整體投資結果：自備款複利 + 每月差額投入
 * 雙方對稱：
 *   差額 = 買房月繳 - 當期月租金
 *   差額 > 0 → 租房方投入該差額
 *   差額 < 0 → 買房方投入該差額絕對值
 *
 * @param {object} inputs DEFAULT_INPUTS
 * @param {object} mortgageResult calculateMortgage 結果
 * @returns {{
 *   renterEtf:number, buyerEtf:number, totalRent:number,
 *   buyerNetWorth:number, renterNetWorth:number,
 *   monthly:Array, // 逐月投資快照（給明細用）
 * }}
 */
export function calculateInvestment(inputs, mortgageResult) {
  const { monthlyRent, rentGrowthRate, etfReturnRate, monthlyHoldingCost = 0 } = inputs;
  const monthlyReturn = Math.pow(1 + etfReturnRate / 100, 1 / 12) - 1; // 月報酬率(複利換算)

  const schedule = generateMonthlySchedule(inputs);

  // 自備款全額投入 ETF（租房方一開始就有此資金可投資）
  let renterEtf = mortgageResult.downPayment;
  let buyerEtf = 0;
  let totalRent = 0;

  const monthly = [];

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    const year = Math.floor(i / 12) + 1; // 1-based
    const rent = calculateRentAtYear(monthlyRent, rentGrowthRate, year);
    totalRent += rent;

    const diff = (row.payment + monthlyHoldingCost) - rent; // (買房月繳 + 持有成本) - 月租金
    let renterContrib = 0;
    let buyerContrib = 0;
    if (diff > 0) {
      renterContrib = diff;
    } else if (diff < 0) {
      buyerContrib = -diff;
    }

    // 先計算當月報酬，再加入當月貢獻
    renterEtf = renterEtf * (1 + monthlyReturn) + renterContrib;
    buyerEtf = buyerEtf * (1 + monthlyReturn) + buyerContrib;

    monthly.push({
      month: row.month,
      year,
      rent,
      mortgagePayment: row.payment,
      diff, // 可為負
      renterContrib,
      buyerContrib,
      renterEtf,
      buyerEtf,
      balance: row.balance,
      principal: row.principal,
      interest: row.interest,
      isGrace: row.isGrace,
    });
  }

  const capitalGainsTax = calculateCapitalGainsTax(
    inputs.housePrice,
    mortgageResult.futureHouseValue,
    inputs.loanYears
  );
  const totalHoldingCost = monthlyHoldingCost * 12 * inputs.loanYears;
  const buyerNetWorth = mortgageResult.futureHouseValue - capitalGainsTax + buyerEtf;
  const renterNetWorth = renterEtf;

  return {
    renterEtf,
    buyerEtf,
    totalRent,
    capitalGainsTax,
    totalHoldingCost,
    buyerNetWorth,
    renterNetWorth,
    monthly,
  };
}

/**
 * 計算完整情境（房貸 + 投資）
 */
export function calculateScenario(inputs) {
  const mortgage = calculateMortgage(inputs);
  const investment = calculateInvestment(inputs, mortgage);
  return { mortgage, investment };
}

/**
 * 從逐月明細抽取每 5 年的快照（REQUIREMENTS 4.2）
 * 取每年 12 月的那一筆為該年代表
 */
export function extractFiveYearSnapshots(monthly, loanYears) {
  const snapshots = [];
  for (let year = 5; year <= loanYears; year += 5) {
    const idx = year * 12 - 1; // 該年最後一個月
    if (idx < monthly.length) {
      snapshots.push({ year, ...monthly[idx] });
    }
  }
  return snapshots;
}

/**
 * 從逐月明細抽取每年的淨資產快照（圖表用）
 * @param {object} scenario { inputs, result: { mortgage, investment } }
 * @returns {Array<{ year, buyerNetWorth, renterNetWorth }>} 單位：萬
 */
export function extractYearlyNetWorth(scenario) {
  const { inputs, result } = scenario;
  const { investment } = result;
  const { monthly } = investment;
  const { housePrice, housePriceGrowthRate, loanYears } = inputs;

  const points = [];
  for (let year = 1; year <= loanYears; year++) {
    const idx = year * 12 - 1;
    if (idx >= monthly.length) break;
    const row = monthly[idx];

    const futureHouseValue = housePrice * 10000 * Math.pow(1 + housePriceGrowthRate / 100, year);
    const capitalGainsTax = calculateCapitalGainsTaxForYear(housePrice, futureHouseValue, year);
    const buyerNetWorth = (futureHouseValue - capitalGainsTax + row.buyerEtf) / 10000;
    const renterNetWorth = row.renterEtf / 10000;

    points.push({
      year,
      buyerNetWorth: Math.round(buyerNetWorth),
      renterNetWorth: Math.round(renterNetWorth),
    });
  }
  return points;
}

/**
 * 計算某年的房地合一稅（內部用，與 mortgage.js 邏輯一致）
 */
function calculateCapitalGainsTaxForYear(housePriceWan, futureHouseValueDollars, holdingYears) {
  const gainDollars = futureHouseValueDollars - housePriceWan * 10000;
  if (gainDollars <= 0) return 0;
  const gainWan = gainDollars / 10000;

  if (holdingYears >= 6) {
    if (gainWan <= 400) return 0;
    return (gainWan - 400) * 10000 * 0.1;
  } else if (holdingYears >= 5) {
    return gainDollars * 0.2;
  } else if (holdingYears >= 2) {
    return gainDollars * 0.35;
  } else {
    return gainDollars * 0.45;
  }
}
