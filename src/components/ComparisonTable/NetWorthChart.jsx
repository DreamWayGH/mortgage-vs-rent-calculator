import React, { useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { extractYearlyNetWorth } from '../../utils/investment';

// 色盤：每個方案一個色系，實線=買房，虛線=租房
const COLOR_PALETTE = [
  { buyer: '#1976d2', renter: '#4caf50' },
  { buyer: '#e65100', renter: '#00897b' },
  { buyer: '#7b1fa2', renter: '#c62828' },
  { buyer: '#00695c', renter: '#ef6c00' },
  { buyer: '#4527a0', renter: '#2e7d32' },
  { buyer: '#ad1457', renter: '#1565c0' },
];

/**
 * 淨資產折線圖
 * @param {{ scenarios: Array }} props
 */
function NetWorthChart({ scenarios }) {
  // 預設全選
  const [visibleIds, setVisibleIds] = useState(() => new Set(scenarios.map((s) => s.id)));

  // 同步新增的方案（自動勾選）
  useMemo(() => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      scenarios.forEach((s) => next.add(s.id));
      // 移除已刪除的
      for (const id of next) {
        if (!scenarios.find((s) => s.id === id)) next.delete(id);
      }
      return next;
    });
  }, [scenarios]);

  const toggleId = (id) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 產生圖表數據：以最長貸款年限為 X 軸，合併各方案
  const { chartData } = useMemo(() => {
    const visible = scenarios.filter((s) => visibleIds.has(s.id));
    if (visible.length === 0) return { chartData: [], maxYear: 0 };

    // 取各方案的年度快照
    const allSeries = visible.map((s) => ({
      id: s.id,
      points: extractYearlyNetWorth(s),
    }));

    const maxY = Math.max(...allSeries.map((s) => s.points.length));
    const data = [];
    for (let i = 0; i < maxY; i++) {
      const row = { year: i + 1 };
      allSeries.forEach((series) => {
        const pt = series.points[i];
        if (pt) {
          row[`buyer_${series.id}`] = pt.buyerNetWorth;
          row[`renter_${series.id}`] = pt.renterNetWorth;
        }
      });
      data.push(row);
    }
    return { chartData: data, maxYear: maxY };
  }, [scenarios, visibleIds]);

  if (scenarios.length === 0) {
    return (
      <Paper sx={{ mx: { xs: 2, md: 4 }, mt: 3, p: 4 }} elevation={0} variant="outlined">
        <Typography color="text.secondary" align="center">
          尚無比較資料，請於上方輸入參數並按「計算」。
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mx: { xs: 2, md: 4 }, mt: 3, p: 2 }} elevation={1}>
      {/* 方案選擇器 */}
      <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 1, px: 1 }}>
        {scenarios.map((s, idx) => (
          <FormControlLabel
            key={s.id}
            control={
              <Checkbox
                size="small"
                checked={visibleIds.has(s.id)}
                onChange={() => toggleId(s.id)}
                sx={{ color: COLOR_PALETTE[idx % COLOR_PALETTE.length].buyer }}
              />
            }
            label={`#${s.id}`}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
          />
        ))}
      </Stack>

      {/* 圖表 */}
      <Box sx={{ width: '100%', height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: '年', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              label={{ value: '萬', angle: -90, position: 'insideLeft' }}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              formatter={(value, name) => [`${value.toLocaleString()} 萬`, name]}
              labelFormatter={(year) => `第 ${year} 年`}
            />
            <Legend />
            {scenarios
              .filter((s) => visibleIds.has(s.id))
              .map((s, idx) => {
                const colors = COLOR_PALETTE[scenarios.indexOf(s) % COLOR_PALETTE.length];
                return (
                  <React.Fragment key={s.id}>
                    <Line
                      type="monotone"
                      dataKey={`buyer_${s.id}`}
                      name={`#${s.id} 買房淨資產`}
                      stroke={colors.buyer}
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey={`renter_${s.id}`}
                      name={`#${s.id} 租房淨資產`}
                      stroke={colors.renter}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls
                    />
                  </React.Fragment>
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default NetWorthChart;
