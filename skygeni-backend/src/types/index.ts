import { Request } from "express";

export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface ErrorResponse {
  status: string;
  message: string;
  error?: any;
}

export interface DashboardData {
  Account: AccountType[];
  ACV: ACVType[];
  Customer: CustomerType[];
  Team: TeamType[];
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  revenueToday: number;
}

export interface AccountType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key: string;
}

export interface ACVType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  ACV_Range: string;
}

export interface CustomerType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Cust_Type: string;
}

export interface TeamType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team: string;
}
