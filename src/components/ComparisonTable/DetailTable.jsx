import React, { useMemo, useState } from 'react';
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
import { formatNumber, formatWan } from '../../utils/formatters';
import { extractFiveYearSnapshots } from '../../utils/investment';

// ─── 明細欄位定義 ───
const DETAIL_COLUMNS = [
  { key: 'year', label: '年份', align: 'left', alwaysVisible: true, getValue: (r) => `第 ${r.year} 年` },
  { key: 'stage', label: '階段', align: 'left', getValue: (r) => (r.isGrace ? '寬限期' : '攤還期') },
  { key: 'mortgagePayment', label: '買房月繳', align: 'right', tooltip: '當期每月總繳金額（寬限期僅繳息 / 攤還期本息均攤）', getValue: (r) => formatNumber(r.mortgagePayment) },
  { key: 'principal', label: '月繳本金', align: 'right', tooltip: '當月償還的貸款本金（寬限期為 0）', getValue: (r) => formatNumber(r.principal) },
  { key: 'interest', label: '月繳利息', align: 'right', tooltip: '剩餘本金 x 月利率', getValue: (r) => formatNumber(r.interest) },
  { key: 'balance', label: '剩餘本金（萬）', align: 'right', tooltip: '尚未償還的貸款餘額', getValue: (r) => formatWan(r.balance) },
  { key: 'rent', label: '當期月租金', align: 'right', tooltip: '初始月租 x (1 + 租金年漲幅)^(年-1)', getValue: (r) => formatNumber(r.rent) },
  { key: 'diff', label: '每月投資額', align: 'right', tooltip: '(買房月繳 + 持有成本) - 月租金；正值=租房方投資，負值=買房方投資', getValue: (r) => formatNumber(r.diff) },
  { key: 'renterEtf', label: '租房方 ETF（萬）', align: 'right', tooltip: '自備款複利 + 每月差額投入累積至該年底', getValue: (r) => formatWan(r.renterEtf) },
  { key: 'buyerEtf', label: '買房方 ETF（萬）', align: 'right', tooltip: '每月差額投入累積至該年底（僅月租 > 買房支出時有投入）', getValue: (r) => formatWan(r.buyerEtf) },
];

// ─── 明細欄位選擇器 ───
function DetailColumnSelector({ visibleKeys, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleable = DETAIL_COLUMNS.filter((c) => !c.alwaysVisible);

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
        <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto', minWidth: 180 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button size="small" onClick={() => onChange(new Set(DETAIL_COLUMNS.map((c) => c.key)))}>
              全選
            </Button>
            <Button size="small" onClick={() => onChange(new Set(DETAIL_COLUMNS.filter((c) => c.alwaysVisible).map((c) => c.key)))}>
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

// ─── 明細主元件 ───
function DetailTable({ monthly, loanYears }) {
  const [visibleKeys, setVisibleKeys] = useState(
    () => new Set(DETAIL_COLUMNS.map((c) => c.key))
  );

  const snapshots = useMemo(
    () => extractFiveYearSnapshots(monthly, loanYears),
    [monthly, loanYears]
  );

  const visibleCols = useMemo(
    () => DETAIL_COLUMNS.filter((c) => visibleKeys.has(c.key)),
    [visibleKeys]
  );

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, mb: 1 }}>
        <Typography variant="subtitle2">每 5 年明細</Typography>
        <DetailColumnSelector visibleKeys={visibleKeys} onChange={setVisibleKeys} />
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {visibleCols.map((col) => (
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
            {snapshots.map((row) => (
              <TableRow key={row.year}>
                {visibleCols.map((col) => (
                  <TableCell key={col.key} align={col.align}>{col.getValue(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DetailTable;
