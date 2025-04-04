import fs from "node:fs/promises";

const filesPath = {
  Account: "./src/static/dashboard-files/Account Industry.json",
  ACV: "./src/static/dashboard-files/ACV Range.json",
  Customer: "./src/static/dashboard-files/Customer Type.json",
  Team: "./src/static/dashboard-files/Team.json",
};

export const readFiles = async () => {
  try {
    const Account = JSON.parse(await fs.readFile(filesPath.Account, "utf-8"));
    const ACV = JSON.parse(await fs.readFile(filesPath.ACV, "utf-8"));
    const Customer = JSON.parse(await fs.readFile(filesPath.Customer, "utf-8"));
    const Team = JSON.parse(await fs.readFile(filesPath.Team, "utf-8"));

    return {
      Account,
      ACV,
      Customer,
      Team,
    };
  } catch (error) {
    console.error("Error === ", error);
  }
};
