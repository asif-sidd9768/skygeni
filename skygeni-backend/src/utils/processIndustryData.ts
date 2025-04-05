import { AccountType } from "../types";

// Helper function to process Industry data
export function processIndustryData(data: AccountType[], quarters: string[]) {
  const industryByQuarter: {
    [key: string]: { industries: any[]; total: number };
  } = {};

  quarters.forEach((quarter) => {
    const quarterData = data.filter(
      (item) => item.closed_fiscal_quarter === quarter
    );
    const totalACV = quarterData.reduce((sum, item) => sum + item.acv, 0);

    industryByQuarter[quarter] = {
      industries: quarterData
        .sort((a, b) => b.acv - a.acv)
        .map((item) => ({
          name: item.Acct_Industry,
          acv: item.acv,
          count: item.count,
          percentage: Math.round((item.acv / totalACV) * 100),
        })),
      total: totalACV,
    };
  });

  return {
    title: "ACV by Industry",
    chartData: industryByQuarter,
  };
}
