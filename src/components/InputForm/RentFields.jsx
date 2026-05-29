import React from 'react';
import { Box, Typography } from '@mui/material';
import NumberField from './NumberField';

// 租房方案欄位（REQUIREMENTS 2.2）
function RentFields({ values, onChange }) {
  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        租房方案
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 2,
        }}
      >
        <NumberField label="月租金（元）" field="monthlyRent" values={values} onChange={onChange} step={500} tooltip="第一年每月租金金額" />
        <NumberField label="租金年漲幅（%）" field="rentGrowthRate" values={values} onChange={onChange} step={0.1} tooltip="每年租金調漲比例，租金逐年複利成長" />
      </Box>
    </div>
  );
}

export default RentFields;
