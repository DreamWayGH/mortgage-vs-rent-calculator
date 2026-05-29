import React, { useState } from 'react';
import { Box, Button, Paper, Stack } from '@mui/material';
import HouseLoanFields from './HouseLoanFields';
import RentFields from './RentFields';
import InvestmentFields from './InvestmentFields';
import AppreciationFields from './AppreciationFields';
import { DEFAULT_INPUTS } from '../../constants/defaults';

const INPUT_STORAGE_KEY = 'mortgage-vs-rent:inputs';

function loadInputs() {
  try {
    const raw = localStorage.getItem(INPUT_STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const saved = JSON.parse(raw);
    // 確保所有欄位都有值（向前相容新增欄位）
    return { ...DEFAULT_INPUTS, ...saved };
  } catch {
    return DEFAULT_INPUTS;
  }
}

/**
 * 主輸入區（卡片式、上方 sticky）
 * @param {{ onSubmit:(inputs)=>void, onClearAll:()=>void }} props
 */
function InputForm({ onSubmit, onClearAll }) {
  const [values, setValues] = useState(loadInputs);

  const handleChange = (field) => (e) => {
    const raw = e.target.value;
    // 允許空字串以便編輯，計算時再轉成數字
    setValues((prev) => ({ ...prev, [field]: raw === '' ? '' : Number(raw) }));
  };

  const validate = () => {
    const v = values;
    if (v.loanRatio < 0 || v.loanRatio > 100) return '貸款成數需在 0-100% 之間';
    if (v.gracePeriodYears > v.loanYears) return '寬限期不能大於貸款年限';
    const fields = Object.entries(v);
    for (const [k, val] of fields) {
      if (val === '' || isNaN(val)) return `欄位「${k}」需為數字`;
      if (val < 0) return `欄位「${k}」不能為負`;
    }
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      return;
    }
    const snapshot = { ...values };
    try {
      localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(snapshot));
    } catch { /* ignore */ }
    onSubmit(snapshot);
  };

  const handleClear = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('確定要清除所有比較結果嗎？')) {
      setValues(DEFAULT_INPUTS);
      try {
        localStorage.removeItem(INPUT_STORAGE_KEY);
      } catch { /* ignore */ }
      onClearAll();
    }
  };

  return (
    <Box component="section" sx={{ mx: { xs: 2, md: 4 }, mt: 3 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <HouseLoanFields values={values} onChange={handleChange} />
          <RentFields values={values} onChange={handleChange} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <AppreciationFields values={values} onChange={handleChange} />
            <InvestmentFields values={values} onChange={handleChange} />
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="error" onClick={handleClear}>
              清除全部
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              計算
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default InputForm;
