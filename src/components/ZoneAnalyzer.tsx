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
import { TradeData } from '../App';

export const ZoneAnalyzer = ({ data }: { data: TradeData[] }) => {
  const [rdRange, setRdRange] = useState<[number, number]>([0.01, 0.03]);
  const [packSizeRange, setPackSizeRange] = useState<[number, number]>([0, 90]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const rd = Number(item.rd_main_class) || 0;
      const ps = Number(item.pack_size_rounded) || 0;
      return (
        rd >= rdRange[0] &&
        rd <= rdRange[1] &&
        ps >= packSizeRange[0] &&
        ps <= packSizeRange[1]
      );
    });
  }, [data, rdRange, packSizeRange]);

  const metrics = useMemo(() => {
    const totalProfit = filteredData.reduce(
      (sum, item) => sum + (Number(item.total_profit2) || 0),
      0
    );
    const dealCount = filteredData.length;
    const lossCount = filteredData.filter(
      (item) => (Number(item.total_profit2) || 0) < 0
    ).length;
    const profitPct = dealCount > 0 ? (dealCount - lossCount) / dealCount : 0;

    return {
      totalProfit: Number(totalProfit.toFixed(2)),
      dealCount,
      lossCount,
      profitPct: Number(profitPct.toFixed(4)),
    };
  }, [filteredData]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Анализ зон
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={4}>
          <Box width="50%">
            <Typography gutterBottom>
              RD Main Class: {rdRange[0].toFixed(2)} - {rdRange[1].toFixed(2)}
            </Typography>
            <Slider
              value={rdRange}
              onChange={(_, newValue) =>
                setRdRange(newValue as [number, number])
              }
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
              onChange={(_, newValue) =>
                setPackSizeRange(newValue as [number, number])
              }
              min={0}
              max={500}
              step={5}
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
              <TableCell>Общий профит</TableCell>
              <TableCell align="right">
                {metrics.totalProfit.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Количество сделок</TableCell>
              <TableCell align="right">{metrics.dealCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Процент прибыльных</TableCell>
              <TableCell align="right">
                {(metrics.profitPct * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
