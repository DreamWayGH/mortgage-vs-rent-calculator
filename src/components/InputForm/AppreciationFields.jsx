import React from 'react';
import { Box, Typography } from '@mui/material';
import NumberField from './NumberField';

// 增值假設欄位（REQUIREMENTS 2.4）
function AppreciationFields({ values, onChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        增值假設
      </Typography>
      <NumberField
        label="房價年漲幅（%）"
        field="housePriceGrowthRate"
        values={values}
        onChange={onChange}
        step={0.1}
        tooltip="房屋每年增值比例，用於計算 N 年後房產市值與房地合一稅"
      />
    </Box>
  );
}

export default AppreciationFields;
