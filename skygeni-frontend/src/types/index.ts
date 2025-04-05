export interface ApiResponse {
  data: DashboardData;
  message: string;
  status: string;
}

export interface DashboardData {
  customerType: CustomerType;
  industry: Industry;
  acvRange: AcvRange;
  team: Team;
}

export interface AcvRange {
  title: string;
  chartData: { [key: string]: AcvRangeChartDatum };
}

export interface AcvRangeChartDatum {
  ranges: Range[];
  total: number;
}

export interface Range {
  range?: string;
  acv: number;
  count: number;
  percentage: number;
  name?: string;
}

export interface CustomerType {
  title: string;
  barChart: BarChart[];
  pieChart: PieChart;
  table: Table;
}

export interface BarChart {
  quarter: string;
  total: number;
  existingCustomer: Customer;
  newCustomer: Customer;
}

export interface Customer {
  value: number;
  percentage: number;
}

export interface PieChart {
  total: number;
  segments: Segment[];
}

export interface Segment {
  type: string;
  value: number;
  percentage: number;
}

export interface Table {
  headers: Array<HeaderClass | string>;
  rows: Row[];
}

export interface HeaderClass {
  quarter: string;
  columns: Column[];
}

export enum Column {
  Acv = "ACV",
  OfOpps = "# of Opps",
  OfTotal = "% of Total",
}

export interface Row {
  custType: string;
  quarters: Total[];
  total: Total;
}

export interface Total {
  oppCount: number;
  acv: number;
  percentage: number;
}

export interface Industry {
  title: string;
  chartData: { [key: string]: IndustryChartDatum };
}

export interface IndustryChartDatum {
  industries: Range[];
  total: number;
}

export interface Team {
  title: string;
  chartData: { [key: string]: TeamChartDatum };
}

export interface TeamChartDatum {
  teams: Range[];
  total: number;
}
