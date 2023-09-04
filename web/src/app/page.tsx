"use client";
import { useLazyQuery } from "@apollo/client";
import { Paper, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import WorkdayAccordion from "../components/WorkdayAccordion";
import { FindWorkdaysDocument } from "../graphql/generated/graphql";

const Home = () => {
  const { t } = useTranslation();
  const [findWorkdays, { data }] = useLazyQuery(FindWorkdaysDocument);
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs().day(1));

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
      <Typography variant="h4">{t("asd")}</Typography>
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
