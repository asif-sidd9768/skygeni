import { CustomerType } from "../types";

// Helper function to process Customer Type data
export function processCustomerTypeData(
  data: CustomerType[],
  quarters: string[]
) {
  // Initialize quarters data
  const quarterTotals: { [key: string]: any } = {};
  quarters.forEach((quarter) => {
    const quarterData = data.filter(
      (item) => item.closed_fiscal_quarter === quarter
    );
    const totalACV = quarterData.reduce((sum, item) => sum + item.acv, 0);
    const existingCustomer = quarterData.find(
      (item) => item.Cust_Type === "Existing Customer"
    ) || { acv: 0, count: 0 };
    const newCustomer = quarterData.find(
      (item) => item.Cust_Type === "New Customer"
    ) || { acv: 0, count: 0 };

    quarterTotals[quarter] = {
      totalACV,
      existingCustomerACV: existingCustomer.acv,
      existingCustomerCount: existingCustomer.count,
      newCustomerACV: newCustomer.acv,
      newCustomerCount: newCustomer.count,
      existingCustomerPercentage: Math.round(
        (existingCustomer.acv / totalACV) * 100
      ),
      newCustomerPercentage: Math.round((newCustomer.acv / totalACV) * 100),
    };
  });

  // Calculate overall totals
  const grandTotal = data.reduce((sum, item) => sum + item.acv, 0);
  const existingCustomerTotal = data
    .filter((item) => item.Cust_Type === "Existing Customer")
    .reduce((sum, item) => sum + item.acv, 0);
  const newCustomerTotal = data
    .filter((item) => item.Cust_Type === "New Customer")
    .reduce((sum, item) => sum + item.acv, 0);

  // Calculate total counts
  const existingCustomerCount = data
    .filter((item) => item.Cust_Type === "Existing Customer")
    .reduce((sum, item) => sum + item.count, 0);
  const newCustomerCount = data
    .filter((item) => item.Cust_Type === "New Customer")
    .reduce((sum, item) => sum + item.count, 0);
  const totalCount = existingCustomerCount + newCustomerCount;

  // Format the data for the dashboard
  return {
    title: "Won ACV mix by Cust Type",
    barChart: quarters.map((quarter) => ({
      quarter,
      total: quarterTotals[quarter].totalACV,
      existingCustomer: {
        value: quarterTotals[quarter].existingCustomerACV,
        percentage: quarterTotals[quarter].existingCustomerPercentage,
      },
      newCustomer: {
        value: quarterTotals[quarter].newCustomerACV,
        percentage: quarterTotals[quarter].newCustomerPercentage,
      },
    })),
    pieChart: {
      total: grandTotal,
      segments: [
        {
          type: "Existing Customer",
          value: existingCustomerTotal,
          percentage: Math.round((existingCustomerTotal / grandTotal) * 100),
        },
        {
          type: "New Customer",
          value: newCustomerTotal,
          percentage: Math.round((newCustomerTotal / grandTotal) * 100),
        },
      ],
    },
    table: {
      headers: [
        "Cust Type",
        ...quarters.map((q) => ({
          quarter: q,
          columns: ["# of Opps", "ACV", "% of Total"],
        })),
        {
          quarter: "Total",
          columns: ["# of Opps", "ACV", "% of Total"],
        },
      ],
      rows: [
        {
          custType: "Existing Customer",
          quarters: quarters.map((quarter) => ({
            oppCount: quarterTotals[quarter].existingCustomerCount,
            acv: quarterTotals[quarter].existingCustomerACV,
            percentage: quarterTotals[quarter].existingCustomerPercentage,
          })),
          total: {
            oppCount: existingCustomerCount,
            acv: existingCustomerTotal,
            percentage: Math.round((existingCustomerTotal / grandTotal) * 100),
          },
        },
        {
          custType: "New Customer",
          quarters: quarters.map((quarter) => ({
            oppCount: quarterTotals[quarter].newCustomerCount,
            acv: quarterTotals[quarter].newCustomerACV,
            percentage: quarterTotals[quarter].newCustomerPercentage,
          })),
          total: {
            oppCount: newCustomerCount,
            acv: newCustomerTotal,
            percentage: Math.round((newCustomerTotal / grandTotal) * 100),
          },
        },
        {
          custType: "Total",
          quarters: quarters.map((quarter) => ({
            oppCount:
              quarterTotals[quarter].existingCustomerCount +
              quarterTotals[quarter].newCustomerCount,
            acv: quarterTotals[quarter].totalACV,
            percentage: 100,
          })),
          total: {
            oppCount: totalCount,
            acv: grandTotal,
            percentage: 100,
          },
        },
      ],
    },
  };
}
