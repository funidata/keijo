"use client";
import { useLazyQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/fi";
import weekday from "dayjs/plugin/weekday";
import { useEffect, useState } from "react";
import WorkdayAccordion from "../components/WorkdayAccordion";
import { FindWorkdaysDocument } from "../graphql/generated/graphql";

dayjs.extend(weekday);

const Home = () => {
  const [findWorkdays, { data }] = useLazyQuery(FindWorkdaysDocument);
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs().locale("fi").weekday(0));

  useEffect(() => {
    const end = start.add(7, "day");
    findWorkdays({ variables: { start, end } });
  }, [start, findWorkdays]);

  const handleStartChange = (val: any) => {
    const date = dayjs(val);
    if (date.isValid()) {
      setStart(date);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <DatePicker value={start} onChange={handleStartChange} />
      <Paper>
        {data.findWorkdays.map((wd) => (
          <WorkdayAccordion workday={wd} key={wd.date} />
        ))}
      </Paper>
    </>
  );
};

export default Home;
