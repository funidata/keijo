"use client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
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
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument } from "../graphql/generated/graphql";

const Home = () => {
  const { t } = useTranslation();
  const { data } = useQuery(FindWorkdaysDocument);

  if (!data) {
    return null;
  }

  return (
    <>
      <Typography variant="h4">{t("asd")}</Typography>
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
