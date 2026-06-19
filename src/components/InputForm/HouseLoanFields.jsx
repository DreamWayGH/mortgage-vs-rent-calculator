import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import NumberField from './NumberField';
import { QINGAN_PRESETS } from '../../constants/defaults';

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
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="qingan-preset-label">新青安方案</InputLabel>
          <Select
            labelId="qingan-preset-label"
            label="新青安方案"
            value={values.qingAnPreset ?? '2.0'}
            onChange={(e) => {
              const preset = e.target.value;
              // 儲存 preset（為字串）
              onChange('qingAnPreset')({ target: { value: preset } });
              // 把 preset 的利率與額度寫回表單
              if (preset && QINGAN_PRESETS[preset]) {
                const p = QINGAN_PRESETS[preset];
                if (p.qingAnRate != null) onChange('qingAnRate')({ target: { value: p.qingAnRate } });
                if (p.qingAnLimit != null) onChange('qingAnLimit')({ target: { value: p.qingAnLimit } });
              }
            }}
          >
            <MenuItem value="1.0">新青安 1.0</MenuItem>
            <MenuItem value="2.0">新青安 2.0</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="body2" color="text.secondary">
            {`計算方式：新青安利率 ${values.qingAnRate ?? '—'}%（額度內）、超額利率 ${values.excessRate ?? '—'}%（超出額度）。`}
          </Typography>
          {values.qingAnPreset && QINGAN_PRESETS[values.qingAnPreset] && QINGAN_PRESETS[values.qingAnPreset].phasedSchedule && (
            <Typography variant="caption" color="text.secondary" display="block">
              {`補助逐步退場（` + QINGAN_PRESETS[values.qingAnPreset].phasedSchedule.map(s => `${s.years} 年 @ ${s.rate}%`).join('，') + `），之後回到基準 ${QINGAN_PRESETS[values.qingAnPreset].qingAnRate}%。計算器以加權年利率近似模擬。`}
            </Typography>
          )}
        </Box>
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
