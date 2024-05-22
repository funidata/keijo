import { readFileSync } from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();
const doc = parser.parse(
  readFileSync(path.resolve(__dirname, "../nv-mock/data/dimensionlist.nv.xml")),
);

const dimensions: Array<{
  Name: string;
  DimensionDetails: { DimensionDetail: Array<{ Name: string }> };
}> = doc.Root.DimensionNameList.DimensionName;

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
    ?.find((x) => x.Name === "3 Tiketti")
    ?.DimensionDetails.DimensionDetail.map((x) => x.Name)!;
  return names;
};

export { getMockProductNames, getMockActivityNames, getMockIssueNames, getMockClientNames };
