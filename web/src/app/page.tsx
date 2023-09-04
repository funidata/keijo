"use client";
import { useLazyQuery } from "@apollo/client";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument } from "../graphql/generated/graphql";

const Home = () => {
  const { t } = useTranslation();
  const [findWorkdays, { data }] = useLazyQuery(FindWorkdaysDocument);
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs().day(1));

  useEffect(() => {
    const end = start.add(7, "day");
    console.log("findWorkdays", start, end);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.findWorkdays.map((wd) => (
              <TableRow key={wd.date}>
                <TableCell>{wd.date}</TableCell>
                <TableCell>{wd.entries.reduce((prev, cur) => prev + cur.duration, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Home;
