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

const getMockProductNames = () => {
  const names = dimensions
    ?.find((x) => x.Name === "1 Tuote")
    ?.DimensionDetails.DimensionDetail.map((x) => x.Name)!;
  return names;
};

const getMockActivityNames = () => {
  const names = dimensions
    ?.find((x) => x.Name === "2 Toiminto")
    ?.DimensionDetails.DimensionDetail.map((x) => x.Name)!;
  return names;
};

const getMockIssueNames = () => {
  const names = dimensions
    ?.find((x) => x.Name === "3 Tiketti")
    ?.DimensionDetails.DimensionDetail.map((x) => x.Name)!;
  return names;
};

const getMockClientNames = () => {
  const names = dimensions
    ?.find((x) => x.Name === "4 Asiakas")
    ?.DimensionDetails.DimensionDetail.map((x) => x.Name)!;
  return names;
};

export const getMockEntries = (): Array<{
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

export { getMockProductNames, getMockActivityNames, getMockIssueNames, getMockClientNames };
