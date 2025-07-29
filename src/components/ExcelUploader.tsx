import { useState } from 'react';
import { read, utils } from 'xlsx';
import { Button, Box, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { TradeData, Period, PeriodData } from '../App';

interface ExcelUploaderProps {
  onDataLoaded: (data: PeriodData) => void;
}

export const ExcelUploader = ({ onDataLoaded }: ExcelUploaderProps) => {
  const [files, setFiles] = useState<Partial<Record<Period, File>>>({});

  const handleFileUpload = (
    period: Period,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [period]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('No file data');

        const workbook = read(data, { type: 'array' });
        const jsonData = utils.sheet_to_json<TradeData>(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        // Полностью типизированное обновление данных
        const newData: PeriodData = {
          '2_weeks': period === '2_weeks' ? jsonData : [],
          '1_month': period === '1_month' ? jsonData : [],
          '2_months': period === '2_months' ? jsonData : [],
        };
        onDataLoaded(newData);
      } catch (error) {
        console.error('Error reading file:', error);
        alert(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid #333', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Загрузка данных
      </Typography>
      {(['2_weeks', '1_month', '2_months'] as Period[]).map((period) => (
        <Box key={period} sx={{ mb: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
          >
            {period.replace('_', ' ')}
            <input
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={(e) => handleFileUpload(period, e)}
            />
          </Button>
          {files[period] && (
            <span style={{ marginLeft: '10px' }}>{files[period]?.name}</span>
          )}
        </Box>
      ))}
    </Box>
  );
};
