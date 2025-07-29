import { useState, useMemo } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'; // Используем alpine вместо alpine-dark
import { TradeData } from '../App';

const GridContainer = ({
  children,
  spacing = 2,
}: {
  children: React.ReactNode;
  spacing?: number;
}) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      margin: `-${spacing * 4}px`,
      '& > *': { padding: `${spacing * 4}px` },
    }}
  >
    {children}
  </Box>
);

const GridItem = ({
  children,
  xs = 12,
  sm = 4,
}: {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
}) => (
  <Box
    sx={{
      width: `${(xs / 12) * 100}%`,
      '@media (min-width:600px)': { width: `${(sm / 12) * 100}%` },
    }}
  >
    {children}
  </Box>
);

export const MainDashboard = ({ data }: { data: TradeData[] }) => {
  const [period, setPeriod] = useState('2_weeks');
  const [analysisGroup, setAnalysisGroup] = useState('');
  const [tradePeriod, setTradePeriod] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (!analysisGroup || item.for_analysis_group === analysisGroup) &&
        (!tradePeriod || item.trade_period === tradePeriod)
    );
  }, [data, analysisGroup, tradePeriod]);

  const columnDefs: ColDef<TradeData>[] = [
    { field: 'group_name', headerName: 'Группа', flex: 1 },
    { field: 'order_side', headerName: 'Сторона', flex: 1 },
    {
      field: 'rd_main_class',
      headerName: 'RD Main Class',
      flex: 1,
      valueFormatter: (p) => p.value?.toFixed(2) || '-',
    },
    { field: 'pack_size_rounded', headerName: 'Pack Size', flex: 1 },
    {
      field: 'total_profit2',
      headerName: 'P2',
      flex: 1,
      valueFormatter: (p) => p.value?.toFixed(2) || '-',
    },
    { field: 'deal_count', headerName: 'C', flex: 1 },
    { field: 'loss_count', headerName: 'L', flex: 1 },
  ];

  // Стили для AG-Grid
  const gridStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    // @ts-ignore - CSS-переменные AG-Grid
    '--ag-borders': 'none',
    // @ts-ignore
    '--ag-border-radius': '8px',
    // @ts-ignore
    '--ag-font-size': '14px',
  };

  return (
    <Box
      sx={{
        p: 3,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Анализ торговых стратегий
      </Typography>

      <Paper sx={{ p: 2 }}>
        <GridContainer spacing={2}>
          <GridItem xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Период</InputLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                label="Период"
              >
                <MenuItem value="2_weeks">2 недели</MenuItem>
                <MenuItem value="1_month">1 месяц</MenuItem>
                <MenuItem value="2_months">2 месяца</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Группа анализа</InputLabel>
              <Select
                value={analysisGroup}
                onChange={(e) => setAnalysisGroup(e.target.value)}
                label="Группа анализа"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="RESTRICTED">RESTRICTED</MenuItem>
                <MenuItem value="POSSIBLE">POSSIBLE</MenuItem>
                <MenuItem value="REAL">REAL</MenuItem>
                <MenuItem value="NO DEAL TYPE">NO DEAL TYPE</MenuItem>
                <MenuItem value="TRADE NO STAT">TRADE NO STAT</MenuItem>
                <MenuItem value="TRADE DUBLICATE">TRADE DUBLICATE</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Торговый период</InputLabel>
              <Select
                value={tradePeriod}
                onChange={(e) => setTradePeriod(e.target.value)}
                label="Торговый период"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="WEEKEND">WEEKEND</MenuItem>
                <MenuItem value="MONDAY_12_20">MONDAY_12_20</MenuItem>
                <MenuItem value="TUESDAY_14_24">TUESDAY_14_24</MenuItem>
                <MenuItem value="WEDNESDAY_14_24">WEDNESDAY_14_24</MenuItem>
                <MenuItem value="OTHER">OTHER</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
        </GridContainer>
      </Paper>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <div
          className="ag-theme-alpine" // Изменено с alpine-dark на alpine
          style={gridStyle}
        >
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            domLayout="autoHeight"
          />
        </div>
      </Box>
    </Box>
  );
};
