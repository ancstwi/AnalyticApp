import { useState } from 'react';
import { ExcelUploader } from './components/ExcelUploader';
import { MainDashboard } from './components/MainDashboard';
import { ZoneAnalyzer } from './components/ZoneAnalyzer';
import { Box } from '@mui/material';

// Явно экспортируем Period
export type Period = '2_weeks' | '1_month' | '2_months';

export interface TradeData {
  group_name: string;
  order_side: string;
  rd_main_class: number;
  pack_size_rounded: number;
  total_profit2: number;
  deal_count: number;
  loss_count: number;
  for_analysis_group?: string;
  trade_period?: string;
  [key: string]: any;
}

export type PeriodData = Record<Period, TradeData[]>;

function App() {
  const [periodData, setPeriodData] = useState<PeriodData>({
    '2_weeks': [],
    '1_month': [],
    '2_months': [],
  });

  const hasData = Object.values(periodData).some((period) => period.length > 0);

  return (
    <Box sx={{ p: 3 }}>
      <ExcelUploader onDataLoaded={setPeriodData} />
      {hasData && (
        <>
          <MainDashboard data={Object.values(periodData).flat()} />
          <ZoneAnalyzer data={Object.values(periodData).flat()} />
        </>
      )}
    </Box>
  );
}

export default App;
