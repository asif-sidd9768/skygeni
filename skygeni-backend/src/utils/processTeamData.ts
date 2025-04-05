import { TeamType } from "../types";

// Helper function to process Team data
export function processTeamData(data: TeamType[], quarters: string[]) {
  const teamByQuarter: { [key: string]: { teams: any[]; total: number } } = {};

  quarters.forEach((quarter) => {
    const quarterData = data.filter(
      (item) => item.closed_fiscal_quarter === quarter
    );
    const totalACV = quarterData.reduce((sum, item) => sum + item.acv, 0);

    teamByQuarter[quarter] = {
      teams: quarterData
        .sort((a, b) => b.acv - a.acv)
        .map((item) => ({
          name: item.Team,
          acv: item.acv,
          count: item.count,
          percentage: Math.round((item.acv / totalACV) * 100),
        })),
      total: totalACV,
    };
  });

  return {
    title: "ACV by Team",
    chartData: teamByQuarter,
  };
}
