import { readFileSync } from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();
const dimensionDoc = parser.parse(
  readFileSync(path.resolve(__dirname, "../nv-mock/data/dimensionlist.nv.xml")),
);

const entryDoc = parser.parse(
  readFileSync(path.resolve(__dirname, "../nv-mock/data/getworkdays.nv.xml")),
);

const dimensions: Array<{
  Name: string;
  DimensionDetails: { DimensionDetail: Array<{ Name: string }> };
}> = dimensionDoc.Root.DimensionNameList.DimensionName;

const workdays: {
  Workday: Array<{
    Date: string;
    WorkdayHour: {
      Hours: string | number;
      Dimension: Array<{ DimensionName: string; DimensionItem: string }>;
    };
  }>;
} = entryDoc.Root.WorkDays;

export enum dimensionNames {
  product = "1 Tuote",
  activity = "2 Toiminto",
  issue = "3 Tiketti",
  client = "4 Asiakas",
}
const getDimensionValues = (dimensionName: string) => {
  const dimension = dimensions?.find((dim) => dim.Name === dimensionName);
  if (!dimension) {
    throw new Error(`Could not find dimension "${dimensionName}".`);
  }
  return dimension.DimensionDetails.DimensionDetail.map((x) => x.Name);
};

const getMockProductNames = () => getDimensionValues(dimensionNames.product);
const getMockActivityNames = () => getDimensionValues(dimensionNames.activity);
const getMockIssueNames = () => getDimensionValues(dimensionNames.issue);
const getMockClientNames = () => getDimensionValues(dimensionNames.product);

const getMockEntries = (): Array<{
  date: string;
  hours: string;
  fields: Array<{
    DimensionName: string;
    DimensionItem: string;
  }>;
}> => {
  return workdays.Workday.flatMap((wd) => {
    if (Array.isArray(wd.WorkdayHour)) {
      return wd.WorkdayHour.map((hour) => ({
        date: wd.Date,
        hours: String(hour.Hours).replace(",", "."),
        fields: hour.Dimension,
      }));
    } else {
      return [
        {
          date: wd.Date,
          hours: String(wd.WorkdayHour.Hours).replace(",", "."),
          fields: wd.WorkdayHour.Dimension,
        },
      ];
    }
  });
};

export {
  getMockProductNames,
  getMockActivityNames,
  getMockIssueNames,
  getMockClientNames,
  getMockEntries,
};
