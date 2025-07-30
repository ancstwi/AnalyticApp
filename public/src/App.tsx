import { useState } from 'react';
import { ExcelUploader } from './components/ExcelUploader';
import { MainDashboard } from './components/MainDashboard';
import { SharpeTable } from './components/SharpeTable';
import { Box, ThemeProvider } from '@mui/material';
import { darkTheme } from './styles/theme';

export type Period = '2_weeks' | '1_month' | '2_months';

export interface TradeData {
  group_name: string;
  order_side: string;
  rd_main_class: number;
  PackSizeRound: number;
  total_profit2: number;
  deal_count: number;
  loss_count: number;
  for_analysis_group?: string;
  trade_period?: string;
}

function App() {
  const [periodData, setPeriodData] = useState<Record<Period, TradeData[]>>({
    '2_weeks': [],
    '1_month': [],
    '2_months': [],
  });

  const handleDataLoaded = (newData: any[], period: Period) => {
    try {
      const validatedData = newData.map((item) => ({
        group_name: String(item['group_name'] || item['Группа'] || ''),
        order_side: String(item['order_side'] || item['Сторона'] || ''),
        rd_main_class: parseFloat(item['rd_main_class'] || item['RD'] || 0),
        PackSizeRound: parseFloat(
          item['PackSizeRound'] || item['Pack Size'] || 0
        ),
        total_profit2: parseFloat(
          item['total_profit2'] || item['Прибыль'] || 0
        ),
        deal_count: parseInt(item['deal_count'] || item['Сделки'] || 0),
        loss_count: parseInt(item['loss_count'] || item['Потери'] || 0),
        for_analysis_group: item['for_analysis_group'] || item['Статус'],
        trade_period: item['trade_period'] || item['Период'],
        // Дополнительные поля
        for_analysis_reason: item['for_analysis_reason'],
        avg_profit: parseFloat(item['avg_profit'] || 0),
        loss_percent: parseFloat(item['loss_percent'] || 0),
        filePeriod: period,
      }));

      setPeriodData((prev) => ({
        ...prev,
        [period]: validatedData,
      }));
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Ошибка обработки данных. Проверьте структуру файла.');
    }
  };

  const hasData = Object.values(periodData).some((period) => period.length > 0);
  const allData = Object.values(periodData).flat();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <ExcelUploader onDataLoaded={handleDataLoaded} />
        {hasData && (
          <>
            <MainDashboard data={allData} />
            <SharpeTable data={allData} />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
