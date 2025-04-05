import { ACVType } from "../types";

// Helper function to process ACV Range data
export function processAcvRangeData(data: ACVType[], quarters: string[]) {
  const acvRangeByQuarter: { [key: string]: { ranges: any[]; total: number } } =
    {};

  quarters.forEach((quarter) => {
    const quarterData = data.filter(
      (item) => item.closed_fiscal_quarter === quarter
    );
    const totalACV = quarterData.reduce((sum, item) => sum + item.acv, 0);

    // Sort by range size
    const ranges = [
      "<$20K",
      "$20K - 50K",
      "$50K - 100K",
      "$100K - 200K",
      ">=$200K",
    ];

    acvRangeByQuarter[quarter] = {
      ranges: quarterData
        .sort(
          (a, b) => ranges.indexOf(a.ACV_Range) - ranges.indexOf(b.ACV_Range)
        )
        .map((item) => ({
          range: item.ACV_Range,
          acv: item.acv,
          count: item.count,
          percentage: Math.round((item.acv / totalACV) * 100),
        })),
      total: totalACV,
    };
  });

  return {
    title: "ACV by Deal Size",
    chartData: acvRangeByQuarter,
  };
}
