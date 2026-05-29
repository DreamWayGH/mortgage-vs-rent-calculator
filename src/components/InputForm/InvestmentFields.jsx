import React from 'react';
import { Box, Typography } from '@mui/material';
import NumberField from './NumberField';

// 投資假設欄位（REQUIREMENTS 2.3）
function InvestmentFields({ values, onChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        投資假設
      </Typography>
      <NumberField
        label="ETF 年化報酬率（%）"
        field="etfReturnRate"
        values={values}
        onChange={onChange}
        step={0.1}
        tooltip="長期投資預期年報酬；建議填入稅後預期值，配息型 ETF 可自行扣除配息稅負"
      />
    </Box>
  );
}

export default InvestmentFields;
