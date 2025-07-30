export interface ExcelRow {
  group_name?: string;
  order_side?: string;
  rd_main_class?: number;
  PackSizeRound?: number;
  total_profit2?: number;
  deal_count?: number;
  loss_count?: number;
  for_analysis_group?: string;
  trade_period?: string;
  [key: string]: any;
}

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

export type PeriodData = Record<Period, TradeData[]>;
