import { Request, Response } from "express";
import { DashboardData } from "../types";
import { readFiles } from "../utils/readFiles";
import { processCustomerTypeData } from "../utils/processCustomerData";
import { processIndustryData } from "../utils/processIndustryData";
import { processAcvRangeData } from "../utils/processAcvRangeData";
import { processTeamData } from "../utils/processTeamData";

// Get dashboard data
export const getDashboardData = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const dashboardData = (await readFiles()) as DashboardData;

    // Get all fiscal quarters from the data
    const quarters = ["2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2"].sort();

    // Process Customer Type data
    const customerTypeByQuarter = processCustomerTypeData(
      dashboardData.Customer,
      quarters
    );
    // Process industry data
    const industryByQuarter = processIndustryData(
      dashboardData.Account,
      quarters
    );
    // Process acv range data
    const acvRangeByQuarter = processAcvRangeData(dashboardData.ACV, quarters);
    // Process tea  data
    const teamByQuarter = processTeamData(dashboardData.Team, quarters);

    res.status(200).json({
      status: "success",
      message: "Dashboard data retrieved successfully",
      data: {
        customerType: customerTypeByQuarter,
        industry: industryByQuarter,
        acvRange: acvRangeByQuarter,
        team: teamByQuarter,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve dashboard data",
    });
  }
};
