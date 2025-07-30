import { useState } from 'react';
import { read, utils } from 'xlsx';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { Period, ExcelRow } from '../types';

interface ExcelUploaderProps {
  onDataLoaded: (data: ExcelRow[], period: Period) => void;
}

export const ExcelUploader = ({ onDataLoaded }: ExcelUploaderProps) => {
  const [fileNames, setFileNames] = useState<Record<Period, string>>({
    '2_weeks': '',
    '1_month': '',
    '2_months': '',
  });
  const [loading, setLoading] = useState<Record<Period, boolean>>({
    '2_weeks': false,
    '1_month': false,
    '2_months': false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    period: Period,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading((prev) => ({ ...prev, [period]: true }));
    setError(null);

    try {
      // 1. Чтение файла
      const data = await file.arrayBuffer();
      const workbook = read(data);

      // 2. Получаем первый лист
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 3. Преобразуем в JSON
      const jsonData = utils.sheet_to_json<Record<string, any>>(worksheet, {
        raw: false, // Получаем значения как есть
        defval: '', // Значение по умолчанию для пустых ячеек
      });

      if (!jsonData.length) {
        throw new Error('Файл не содержит данных');
      }

      // 4. Проверяем структуру данных
      console.log('Первая строка данных:', jsonData[0]);

      // 5. Преобразуем данные
      const mappedData = jsonData.map((row): ExcelRow => {
        // Основные обязательные поля
        const result: ExcelRow = {
          group_name: String(row['group_name'] || ''),
          order_side: String(row['order_side'] || ''),
          rd_main_class: Number(row['rd_main_class']) || 0,
          PackSizeRound: Number(row['PackSizeRound']) || 0,
          total_profit2: Number(row['total_profit2']) || 0,
          deal_count: Number(row['deal_count']) || 0,
          loss_count: Number(row['loss_count']) || 0,
        };

        // Опциональные поля
        if ('for_analysis_group' in row) {
          result.for_analysis_group = String(row['for_analysis_group']);
        }
        if ('trade_period' in row) {
          result.trade_period = String(row['trade_period']);
        }
        if ('for_analysis_reason' in row) {
          result.for_analysis_reason = String(row['for_analysis_reason']);
        }

        return result;
      });

      console.log('Первые 3 преобразованные записи:', mappedData.slice(0, 3));

      setFileNames((prev) => ({ ...prev, [period]: file.name }));
      onDataLoaded(mappedData, period);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(
        `Ошибка при загрузке файла: ${
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [period]: false }));
    }
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Загрузка данных
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {error}
        </Alert>
      )}
      {(['2_weeks', '1_month', '2_months'] as Period[]).map((period) => (
        <Box key={period} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            disabled={loading[period]}
            sx={{ mr: 2 }}
          >
            {period.replace('_', ' ')}
            {loading[period] && <CircularProgress size={24} sx={{ ml: 1 }} />}
            <input
              type="file"
              hidden
              accept=".xlsx, .xls, .csv"
              onChange={(e) => handleFileUpload(period, e)}
            />
          </Button>
          {fileNames[period] && (
            <Typography variant="body2">{fileNames[period]}</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
