import React from 'react';
import { Box, Typography } from '@mui/material';
import NumberField from './NumberField';

// 房屋與貸款欄位（REQUIREMENTS 2.1）
function HouseLoanFields({ values, onChange }) {
  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        房屋與貸款
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 2,
        }}
      >
        <NumberField label="房屋總價（萬）" field="housePrice" values={values} onChange={onChange} tooltip="購屋標的總價格（含土地與建物）" />
        <NumberField label="貸款成數（%）" field="loanRatio" values={values} onChange={onChange} tooltip="銀行核貸比例，通常為 70~85%" />
        <NumberField label="新青安額度上限（萬）" field="qingAnLimit" values={values} onChange={onChange} tooltip="新青安政策貸款上限，超出部分適用一般利率" />
        <NumberField label="新青安利率（%）" field="qingAnRate" values={values} onChange={onChange} step={0.001} tooltip="新青安優惠年利率，適用於額度上限內的貸款" />
        <NumberField label="超額部分利率（%）" field="excessRate" values={values} onChange={onChange} step={0.001} tooltip="超過新青安額度的貸款適用一般首購利率" />
        <NumberField label="貸款年限（年）" field="loanYears" values={values} onChange={onChange} tooltip="總貸款年數，新青安最長可達 40 年" />
        <NumberField label="寬限期（年）" field="gracePeriodYears" values={values} onChange={onChange} tooltip="只繳息不還本的年數，期間月繳較低" />
        <NumberField label="每月持有成本（元）" field="monthlyHoldingCost" values={values} onChange={onChange} tooltip="房屋稅、地價稅、管理費、維修費等月均攤總和" />
      </Box>
    </div>
  );
}

export default HouseLoanFields;
