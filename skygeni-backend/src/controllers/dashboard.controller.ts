import { Request, Response } from "express";
import { DashboardData, DashboardStats } from "../types";
import { readFiles } from "../utils/readFiles";

// Get dashboard data
export const getDashboardData = async (
  _: Request,
  res: Response
): Promise<void> => {
  const dashboardData = (await readFiles()) as DashboardData;

  res.status(200).json({
    status: "success",
    message: "Dashboard data retrieved successfully",
    data: dashboardData,
  });
};

// Get stats
export const getStats = (req: Request, res: Response): void => {
  const stats: DashboardStats = {
    totalUsers: 100,
    activeUsers: 65,
    totalItems: 250,
    revenueToday: 1250,
  };

  res.status(200).json({
    status: "success",
    message: "Dashboard stats retrieved successfully",
    data: stats,
  });
};
