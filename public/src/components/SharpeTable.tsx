import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Slider,
} from '@mui/material';
import { TradeData } from '../App';

export const SharpeTable = ({ data }: { data: TradeData[] }) => {
  const [rdRange, setRdRange] = useState<[number, number]>([0.01, 0.03]);
  const [packSizeRange, setPackSizeRange] = useState<[number, number]>([0, 90]);

  const { sharpeRatio, dealCount, profitPercentage, totalProfit } =
    useMemo(() => {
      const filtered = data.filter((item) => {
        const rd = item.rd_main_class || 0;
        const ps = item.PackSizeRound || 0;
        return (
          rd >= rdRange[0] &&
          rd <= rdRange[1] &&
          ps >= packSizeRange[0] &&
          ps <= packSizeRange[1]
        );
      });

      if (filtered.length === 0) {
        return {
          sharpeRatio: '0.00',
          dealCount: 0,
          profitPercentage: '0%',
          totalProfit: '0.00',
        };
      }

      const profits = filtered.map((item) => item.total_profit2 || 0);
      const total = profits.reduce((sum, p) => sum + p, 0);
      const avg = total / filtered.length;
      const variance =
        filtered.reduce((sum, item) => {
          const profit = item.total_profit2 || 0;
          return sum + Math.pow(profit - avg, 2);
        }, 0) / filtered.length;
      const stdDev = Math.sqrt(variance);

      return {
        sharpeRatio: stdDev ? (avg / stdDev).toFixed(2) : '0.00',
        dealCount: filtered.length,
        profitPercentage:
          (
            (filtered.filter((item) => (item.total_profit2 || 0) > 0).length /
              filtered.length) *
            100
          ).toFixed(1) + '%',
        totalProfit: total.toFixed(2),
      };
    }, [data, rdRange, packSizeRange]);

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        Анализ коэффициента Шарпа
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1e1e1e' }}>
        <Box display="flex" gap={4}>
          <Box width="50%">
            <Typography sx={{ color: 'white' }}>
              RD: {rdRange[0].toFixed(2)} - {rdRange[1].toFixed(2)}
            </Typography>
            <Slider
              value={rdRange}
              onChange={(_, v) => setRdRange(v as [number, number])}
              min={0}
              max={0.2}
              step={0.01}
              valueLabelDisplay="auto"
              sx={{
                color: '#ffa726',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ffa726',
                },
              }}
            />
          </Box>
          <Box width="50%">
            <Typography sx={{ color: 'white' }}>
              Pack Size: {packSizeRange[0]} - {packSizeRange[1]}
            </Typography>
            <Slider
              value={packSizeRange}
              onChange={(_, v) => setPackSizeRange(v as [number, number])}
              min={0}
              max={500}
              step={3}
              valueLabelDisplay="auto"
              sx={{
                color: '#ffa726',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ffa726',
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#252525' }}>
              <TableCell sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                Метрика
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#ffa726', fontWeight: 'bold' }}
              >
                Значение
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Коэффициент Шарпа</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                {sharpeRatio}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Количество сделок</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                {dealCount}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Общий профит</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                {totalProfit}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Процент прибыльных</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                {profitPercentage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
