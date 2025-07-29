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
} from '@mui/material';
import { TradeData, Period } from '../App';

interface Metrics {
  dealCount: number;
  profit: number;
  positiveDeals: number;
  sharpeRatio: number;
}

export const SharpeTable = ({
  data,
  rdRange,
  packSizeRange,
}: {
  data: Record<Period, TradeData[]>;
  rdRange: [number, number];
  packSizeRange: [number, number];
}) => {
  const calculateMetrics = (periodData: TradeData[]): Metrics | null => {
    const filtered = periodData.filter((item) => {
      const rd = Number(item.rd_main_class) || 0;
      const ps = Number(item.pack_size_rounded) || 0;
      return (
        rd >= rdRange[0] &&
        rd <= rdRange[1] &&
        ps >= packSizeRange[0] &&
        ps <= packSizeRange[1]
      );
    });

    if (filtered.length === 0) return null;

    const profits = filtered.map((item) => Number(item.total_profit2) || 0);
    const avgProfit = profits.reduce((a, b) => a + b, 0) / profits.length;
    const stdDev = Math.sqrt(
      profits.reduce((sq, n) => sq + Math.pow(n - avgProfit, 2), 0) /
        profits.length
    );
    const sharpeRatio = stdDev !== 0 ? avgProfit / stdDev : 0;

    return {
      dealCount: filtered.length,
      profit: Number(profits.reduce((a, b) => a + b, 0).toFixed(2)),
      positiveDeals: filtered.filter(
        (item) => (Number(item.total_profit2) || 0) > 0
      ).length,
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
    };
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Таблица Шарпа
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Период</TableCell>
              <TableCell align="right">Sharpe</TableCell>
              <TableCell align="right">Сделки</TableCell>
              <TableCell align="right">Профит</TableCell>
              <TableCell align="right">% Прибыльных</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Object.entries(data) as [Period, TradeData[]][]).map(
              ([period, periodData]) => {
                const metrics = calculateMetrics(periodData);
                return metrics ? (
                  <TableRow key={period}>
                    <TableCell>{period.replace('_', ' ')}</TableCell>
                    <TableCell align="right">
                      {metrics.sharpeRatio.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{metrics.dealCount}</TableCell>
                    <TableCell align="right">
                      {metrics.profit.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {Math.round(
                        (metrics.positiveDeals / metrics.dealCount) * 100
                      )}
                      %
                    </TableCell>
                  </TableRow>
                ) : null;
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
