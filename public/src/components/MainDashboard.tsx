import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Checkbox,
  ListItemText,
  useTheme,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TradeData } from '../App';

export const MainDashboard = ({ data }: { data: TradeData[] }) => {
  const theme = useTheme();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const statusOptions = [
    'REAL',
    'POSSIBLE',
    'RESTRICTED',
    'NO DEAL TYPE',
    'TRADE NO STAT',
    'TRADE DUBLICATE',
  ];

  const periodOptions = [
    '',
    'WEEKEND',
    'MONDAY_12_20',
    'TUESDAY_14_24',
    'WEDNESDAY_14_24',
    'OTHER',
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    console.log('Первые 3 записи:', data.slice(0, 3));

    // Получаем уникальные группы без использования Set
    const groups = data
      .map((item) => item.group_name?.toString().trim() || '')
      .filter((group, index, arr) => group && arr.indexOf(group) === index);

    console.log('Найденные группы:', groups);

    if (groups.length === 0) {
      console.error('Не найдено ни одной валидной группы! Проверьте данные.');
    }

    setAvailableGroups(groups);
    setSelectedGroups(groups);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (selectedGroups.length === 0 ||
          selectedGroups.includes(item.group_name)) &&
        (selectedStatus.length === 0 ||
          selectedStatus.includes(item.for_analysis_group || '')) &&
        (!selectedPeriod || item.trade_period === selectedPeriod)
    );
  }, [data, selectedGroups, selectedStatus, selectedPeriod]);

  const columnDefs: ColDef<TradeData>[] = [
    {
      field: 'group_name',
      headerName: 'Группа',
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      field: 'rd_main_class',
      headerName: 'RD',
      width: 100,
      valueFormatter: (p) => p.value?.toFixed(2) || '-',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'PackSizeRound',
      headerName: 'Pack Size',
      width: 120,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'total_profit2',
      headerName: 'P2',
      width: 100,
      valueFormatter: (p) => p.value?.toFixed(2) || '-',
      cellStyle: { color: theme.palette.secondary.main },
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'deal_count',
      headerName: 'C',
      width: 80,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'loss_count',
      headerName: 'L',
      width: 80,
      filter: 'agNumberColumnFilter',
    },
  ];

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
      <Typography variant="h4">Сводная таблица сделок</Typography>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Группы роботов</InputLabel>
            <Select
              multiple
              value={selectedGroups}
              onChange={(e) => setSelectedGroups(e.target.value as string[])}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  <Checkbox checked={selectedGroups.includes(group)} />
                  <ListItemText primary={group} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Статус сделки</InputLabel>
            <Select
              multiple
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as string[])}
              renderValue={(selected) => selected.join(', ')}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={selectedStatus.includes(status)} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Торговый период</InputLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as string)}
            >
              {periodOptions.map((period) => (
                <MenuItem key={period} value={period}>
                  {period || 'Все'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box sx={{ flex: 1 }}>
        <div
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
          />
        </div>
      </Box>
    </Box>
  );
};
