import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ComparisonRow from './ComparisonRow';
import { formatNumber, formatPercent, formatWan } from '../../utils/formatters';

// ─── 欄位定義 ───
export const COMPARISON_COLUMNS = [
  // 固定欄位
  { key: 'id', label: '#', align: 'left', alwaysVisible: true },
  // 輸入值欄位
  { key: 'housePrice', label: '房屋總價（萬）', align: 'right' },
  { key: 'loanYears', label: '貸款年限', align: 'right' },
  { key: 'gracePeriod', label: '寬限期', align: 'right' },
  { key: 'qingAnRate', label: '新青安利率', align: 'right' },
  { key: 'monthlyRent', label: '月租金', align: 'right' },
  { key: 'rentGrowth', label: '租金漲幅', align: 'right' },
  { key: 'etfReturn', label: 'ETF 報酬率', align: 'right' },
  { key: 'housePriceGrowth', label: '房價漲幅', align: 'right' },
  // 計算值欄位（含 tooltip 公式說明）
  { key: 'gracePayment', label: '寬限期月繳', align: 'right', tooltip: '新青安貸款額 × 月利率 + 超額貸款額 × 月利率' },
  { key: 'amortPayment', label: '攤還期月繳', align: 'right', tooltip: '兩筆貸款分別以本息均攤公式計算後加總：P×r×(1+r)ⁿ / [(1+r)ⁿ-1]' },
  { key: 'totalInterest', label: '總利息（萬）', align: 'right', tooltip: '總繳款 - 總貸款金額' },
  { key: 'futureHouseValue', label: 'N年後房產市值（萬）', align: 'right', tooltip: '房屋總價 × (1 + 房價年漲幅)ⁿ' },
  { key: 'totalHoldingCost', label: '累計持有成本（萬）', align: 'right', tooltip: '每月持有成本 × 12 × 貸款年限' },
  { key: 'capitalGainsTax', label: '房地合一稅（萬）', align: 'right', tooltip: '自住滿6年：增值≤400萬免稅，超出部分×10%' },
  { key: 'buyerEtf', label: '買房方 ETF（萬）', align: 'right', tooltip: '月租金 > 買房總支出時，買房方將差額投入ETF複利累積' },
  { key: 'renterEtf', label: '租房方 ETF（萬）', align: 'right', tooltip: '自備款複利 + 買房總支出 > 月租金時的差額複利累積' },
  { key: 'buyerNetWorth', label: '買房淨資產（萬）', align: 'right', tooltip: '房產市值 - 房地合一稅 + 買房方 ETF' },
  { key: 'renterNetWorth', label: '租房淨資產（萬）', align: 'right', tooltip: '租房方 ETF 總資產' },
  { key: 'diff', label: '淨資產差距（萬）', align: 'right', tooltip: '租房淨資產 - 買房淨資產（正值 = 租房勝）' },
  // 操作欄位
  { key: 'winner', label: '勝出方', align: 'center', alwaysVisible: true },
  { key: 'actions', label: '操作', align: 'center', alwaysVisible: true },
];

export function getCellValue(key, scenario) {
  const { inputs, result } = scenario;
  const { mortgage, investment } = result;
  const map = {
    id: scenario.id,
    housePrice: formatNumber(inputs.housePrice),
    loanYears: inputs.loanYears,
    gracePeriod: inputs.gracePeriodYears,
    qingAnRate: formatPercent(inputs.qingAnRate),
    monthlyRent: formatNumber(inputs.monthlyRent),
    rentGrowth: formatPercent(inputs.rentGrowthRate),
    etfReturn: formatPercent(inputs.etfReturnRate),
    housePriceGrowth: formatPercent(inputs.housePriceGrowthRate),
    gracePayment: formatNumber(mortgage.gracePayment),
    amortPayment: formatNumber(mortgage.amortPayment),
    totalInterest: formatWan(mortgage.totalInterest),
    futureHouseValue: formatWan(mortgage.futureHouseValue),
    totalHoldingCost: formatWan(investment.totalHoldingCost),
    capitalGainsTax: formatWan(investment.capitalGainsTax),
    buyerEtf: formatWan(investment.buyerEtf),
    renterEtf: formatWan(investment.renterEtf),
    buyerNetWorth: formatWan(investment.buyerNetWorth),
    renterNetWorth: formatWan(investment.renterNetWorth),
    diff: formatWan(investment.renterNetWorth - investment.buyerNetWorth),
  };
  return map[key] ?? '';
}

// ─── 欄位選擇器 ───
function ColumnSelector({ columns, visibleKeys, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleable = columns.filter((c) => !c.alwaysVisible);

  const handleToggle = (key) => {
    const next = new Set(visibleKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
  };

  return (
    <>
      <Button
        size="small"
        startIcon={<ViewColumnIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="outlined"
      >
        欄位顯示
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto', minWidth: 200 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button size="small" onClick={() => onChange(new Set(columns.map((c) => c.key)))}>
              全選
            </Button>
            <Button size="small" onClick={() => onChange(new Set(columns.filter((c) => c.alwaysVisible).map((c) => c.key)))}>
              全不選
            </Button>
          </Stack>
          <Stack>
            {toggleable.map((col) => (
              <FormControlLabel
                key={col.key}
                control={
                  <Checkbox
                    size="small"
                    checked={visibleKeys.has(col.key)}
                    onChange={() => handleToggle(col.key)}
                  />
                }
                label={col.label}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
              />
            ))}
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

// ─── 主元件 ───
function ComparisonTable({ scenarios, onRemove, onToggleExpand }) {
  const [visibleKeys, setVisibleKeys] = useState(
    () => new Set(COMPARISON_COLUMNS.map((c) => c.key))
  );

  const visibleColumns = useMemo(
    () => COMPARISON_COLUMNS.filter((c) => visibleKeys.has(c.key)),
    [visibleKeys]
  );

  if (!scenarios || scenarios.length === 0) {
    return (
      <Paper sx={{ mx: { xs: 2, md: 4 }, mt: 3, p: 4 }} elevation={0} variant="outlined">
        <Typography color="text.secondary" align="center">
          尚無比較資料，請於上方輸入參數並按「計算」。
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mx: { xs: 2, md: 4 }, mt: 3 }} elevation={1}>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <ColumnSelector columns={COMPARISON_COLUMNS} visibleKeys={visibleKeys} onChange={setVisibleKeys} />
      </Box>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {col.tooltip ? (
                    <Tooltip title={col.tooltip} arrow enterTouchDelay={0} leaveTouchDelay={3000} placement="bottom">
                      <span style={{ borderBottom: '1px dashed currentColor', cursor: 'help' }}>{col.label}</span>
                    </Tooltip>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarios.map((s) => (
              <ComparisonRow
                key={s.id}
                scenario={s}
                visibleColumns={visibleColumns}
                onRemove={onRemove}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ComparisonTable;
