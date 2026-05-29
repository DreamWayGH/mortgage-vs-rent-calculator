// 數字格式化工具（依 REQUIREMENTS.md 六、UI 規格）

/** 千分位逗號、四捨五入至整數 */
export function formatNumber(value) {
  if (value == null || isNaN(value)) return '-';
  return Math.round(value).toLocaleString('en-US');
}

/**
 * 將「元」轉成「萬」並四捨五入至整數、千分位
 * @param {number} valueInDollars
 */
export function formatWan(valueInDollars) {
  if (valueInDollars == null || isNaN(valueInDollars)) return '-';
  return Math.round(valueInDollars / 10000).toLocaleString('en-US');
}

/** 直接以「萬」為單位的數字格式化 */
export function formatWanDirect(valueInWan) {
  if (valueInWan == null || isNaN(valueInWan)) return '-';
  return Math.round(valueInWan).toLocaleString('en-US');
}

/** 百分比，保留小數 1 位 */
export function formatPercent(value) {
  if (value == null || isNaN(value)) return '-';
  return `${Number(value).toFixed(1)}%`;
}
