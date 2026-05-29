import React, { useState } from 'react';
import { Box, CssBaseline, Tab, Tabs } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Header from './components/Layout/Header';
import InputForm from './components/InputForm/InputForm';
import ComparisonTable from './components/ComparisonTable/ComparisonTable';
import NetWorthChart from './components/ComparisonTable/NetWorthChart';
import useScenarios from './hooks/useScenarios';

function App() {
  const { scenarios, addScenario, removeScenario, clearAll, toggleExpand } =
    useScenarios();
  const [viewTab, setViewTab] = useState(0);

  return (
    <>
      <CssBaseline />
      <Header />
      <InputForm onSubmit={addScenario} onClearAll={clearAll} />
      <Box sx={{ mx: { xs: 2, md: 4 }, mt: 3 }}>
        <Tabs
          value={viewTab}
          onChange={(_, v) => setViewTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<TableChartIcon />} iconPosition="start" label="表格" />
          <Tab icon={<ShowChartIcon />} iconPosition="start" label="圖表" />
        </Tabs>
      </Box>
      {viewTab === 0 && (
        <ComparisonTable
          scenarios={scenarios}
          onRemove={removeScenario}
          onToggleExpand={toggleExpand}
        />
      )}
      {viewTab === 1 && <NetWorthChart scenarios={scenarios} />}
    </>
  );
}

export default App;
