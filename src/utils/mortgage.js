// 房貸相關計算（REQUIREMENTS 3.1）
//
// 單位約定：
// - 輸入 housePrice、qingAnLimit 為「萬」
// - 內部計算與輸出的金額一律換算成「元」（除非欄位名稱另註）

/**
 * 本息均攤公式： P × r × (1+r)^n / [(1+r)^n - 1]
 * @param {number} principal 本金（元）
 * @param {number} monthlyRate 月利率（小數）
 * @param {number} months 攤還月數
 */
export function calculateAmortizedPayment(principal, monthlyRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * 主要房貸計算
 * @param {object} inputs DEFAULT_INPUTS 形狀
 * @returns {object}
 */
export function calculateMortgage(inputs) {
  const {
    housePrice,
    loanRatio,
    qingAnLimit,
    qingAnRate,
    excessRate,
    loanYears,
    gracePeriodYears,
    housePriceGrowthRate,
  } = inputs;

  const housePriceDollars = housePrice * 10000;
  const downPayment = housePriceDollars * (1 - loanRatio / 100); // 元
  const totalLoan = housePriceDollars * (loanRatio / 100); // 元
  const qingAnLoan = Math.min(totalLoan, qingAnLimit * 10000); // 元
  const excessLoan = Math.max(0, totalLoan - qingAnLoan); // 元

  const qingAnMonthlyRate = qingAnRate / 100 / 12;
  const excessMonthlyRate = excessRate / 100 / 12;

  const totalMonths = loanYears * 12;
  const graceMonths = gracePeriodYears * 12;
  const amortMonths = totalMonths - graceMonths;

  // 寬限期月繳（只繳息）
  const gracePayment =
    qingAnLoan * qingAnMonthlyRate + excessLoan * excessMonthlyRate;

  // 攤還期月繳（本息均攤，兩筆貸款分別計算）
  const qingAnAmortPayment = calculateAmortizedPayment(
    qingAnLoan,
    qingAnMonthlyRate,
    amortMonths
  );
  const excessAmortPayment = calculateAmortizedPayment(
    excessLoan,
    excessMonthlyRate,
    amortMonths
  );
  const amortPayment = qingAnAmortPayment + excessAmortPayment;

  const totalPaid = gracePayment * graceMonths + amortPayment * amortMonths;
  const totalInterest = totalPaid - totalLoan;

  const futureHouseValue = calculateFutureHouseValue(
    housePriceDollars,
    housePriceGrowthRate,
    loanYears
  );

  return {
    housePriceDollars,
    downPayment,
    totalLoan,
    qingAnLoan,
    excessLoan,
    qingAnMonthlyRate,
    excessMonthlyRate,
    totalMonths,
    graceMonths,
    amortMonths,
    gracePayment,
    amortPayment,
    totalPaid,
    totalInterest,
    futureHouseValue,
  };
}

/**
 * 計算 N 年後房產市值
 * @param {number} housePriceDollars 房屋總價（元）
 * @param {number} growthRate 年漲幅（%）
 * @param {number} years
 */
export function calculateFutureHouseValue(housePriceDollars, growthRate, years) {
  return housePriceDollars * Math.pow(1 + growthRate / 100, years);
}

/**
 * 房地合一稅（自住優惠）計算（REQUIREMENTS 3.3）
 * @param {number} housePriceWan 原始房屋總價（萬）
 * @param {number} futureHouseValueDollars N年後房產市值（元）
 * @param {number} holdingYears 持有年限
 * @returns {number} 稅額（元）
 */
export function calculateCapitalGainsTax(housePriceWan, futureHouseValueDollars, holdingYears) {
  const gainDollars = futureHouseValueDollars - housePriceWan * 10000;
  if (gainDollars <= 0) return 0;

  const gainWan = gainDollars / 10000;

  if (holdingYears >= 6) {
    // 自住優惠：400 萬以下免稅，超出部分 10%
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

/**
 * 產生逐月房貸明細（內部用）：每個月的月繳、利息、本金、剩餘本金
 * @returns {Array<{month, payment, interest, principal, balance, isGrace}>}
 */
export function generateMonthlySchedule(inputs) {
  const m = calculateMortgage(inputs);
  const schedule = [];

  let qingAnBalance = m.qingAnLoan;
  let excessBalance = m.excessLoan;

  // 寬限期：只繳息
  for (let month = 1; month <= m.graceMonths; month++) {
    const interest =
      qingAnBalance * m.qingAnMonthlyRate + excessBalance * m.excessMonthlyRate;
    schedule.push({
      month,
      payment: m.gracePayment,
      interest,
      principal: 0,
      balance: qingAnBalance + excessBalance,
      isGrace: true,
    });
  }

  // 攤還期：本息均攤
  const qingAnAmort = calculateAmortizedPayment(
    m.qingAnLoan,
    m.qingAnMonthlyRate,
    m.amortMonths
  );
  const excessAmort = calculateAmortizedPayment(
    m.excessLoan,
    m.excessMonthlyRate,
    m.amortMonths
  );

  for (let i = 1; i <= m.amortMonths; i++) {
    const qaInterest = qingAnBalance * m.qingAnMonthlyRate;
    const qaPrincipal = qingAnAmort - qaInterest;
    qingAnBalance = Math.max(0, qingAnBalance - qaPrincipal);

    const exInterest = excessBalance * m.excessMonthlyRate;
    const exPrincipal = excessAmort - exInterest;
    excessBalance = Math.max(0, excessBalance - exPrincipal);

    schedule.push({
      month: m.graceMonths + i,
      payment: qingAnAmort + excessAmort,
      interest: qaInterest + exInterest,
      principal: qaPrincipal + exPrincipal,
      balance: qingAnBalance + excessBalance,
      isGrace: false,
    });
  }

  return schedule;
}
