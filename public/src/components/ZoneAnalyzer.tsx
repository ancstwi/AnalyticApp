import { useState, useMemo } from 'react';
import {
  Box,
  Slider,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TradeData } from '../types';

export const ZoneAnalyzer = ({ data }: { data: TradeData[] }) => {
  const [rdRange, setRdRange] = useState<[number, number]>([0.01, 0.03]);
  const [packSizeRange, setPackSizeRange] = useState<[number, number]>([0, 90]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const rd = Number(item.rd_main_class) || 0;
      const ps = Number(item.PackSizeRound) || 0;
      return (
        rd >= rdRange[0] &&
        rd <= rdRange[1] &&
        ps >= packSizeRange[0] &&
        ps <= packSizeRange[1]
      );
    });
  }, [data, rdRange, packSizeRange]);

  const metrics = useMemo(() => {
    const profits = filteredData.map((item) => Number(item.total_profit2) || 0);
    const totalProfit = profits.reduce((sum, profit) => sum + profit, 0);
    const dealCount = filteredData.length;
    const positiveDeals = filteredData.filter(
      (item) => (Number(item.total_profit2) || 0) > 0
    ).length;
    const profitPercentage =
      dealCount > 0 ? (positiveDeals / dealCount) * 100 : 0;

    const avgProfit = dealCount > 0 ? totalProfit / dealCount : 0;
    const stdDev =
      dealCount > 1
        ? Math.sqrt(
            filteredData.reduce((sum, item) => {
              const profit = Number(item.total_profit2) || 0;
              return sum + Math.pow(profit - avgProfit, 2);
            }, 0) / dealCount
          )
        : 0;

    return {
      totalProfit: totalProfit.toFixed(2),
      dealCount,
      profitPercentage: profitPercentage.toFixed(1) + '%',
      sharpeRatio: stdDev !== 0 ? (avgProfit / stdDev).toFixed(2) : '0.00',
      avgProfit: avgProfit.toFixed(2),
    };
  }, [filteredData]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Анализ выбранной зоны
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={4}>
          <Box width="50%">
            <Typography gutterBottom>
              RD: {rdRange[0].toFixed(2)} - {rdRange[1].toFixed(2)}
            </Typography>
            <Slider
              value={rdRange}
              onChange={(_, v) => setRdRange(v as [number, number])}
              min={0}
              max={0.5}
              step={0.01}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box width="50%">
            <Typography gutterBottom>
              Pack Size: {packSizeRange[0]} - {packSizeRange[1]}
            </Typography>
            <Slider
              value={packSizeRange}
              onChange={(_, v) => setPackSizeRange(v as [number, number])}
              min={0}
              max={500}
              step={10}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Метрика</TableCell>
              <TableCell align="right">Значение</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Количество сделок</TableCell>
              <TableCell align="right">{metrics.dealCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Общий профит</TableCell>
              <TableCell align="right">{metrics.totalProfit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Средний профит</TableCell>
              <TableCell align="right">{metrics.avgProfit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Процент прибыльных</TableCell>
              <TableCell align="right">{metrics.profitPercentage}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Коэффициент Шарпа</TableCell>
              <TableCell align="right">{metrics.sharpeRatio}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
