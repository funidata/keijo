import { Box, ListItem, ListItemProps, Typography } from "@mui/material";
import dayjs from "dayjs";
import { roundToFullMinutes } from "../../../common/duration";
import { EntryTemplateType } from "../../../graphql/generated/graphql";
import DimensionChip from "./DimensionChip";
import { ReactNode } from "react";

type EntryListItemProps = {
  entry: EntryTemplateType;
  action: ReactNode;
} & ListItemProps;

const EntryListItem = ({ entry, action, ...listItemProps }: EntryListItemProps) => {
  const { product, activity, issue, client, description } = entry;
  const roundedDuration = roundToFullMinutes(dayjs.duration(entry.duration, "hour"));

  return (
    <ListItem
      {...listItemProps}
      sx={{
        borderRadius: 4,
        pl: 1,
        pt: 0,
        pb: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        ...listItemProps.sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          overflowX: { xs: "auto", md: "hidden" },
          overflowY: "hidden",
          whiteSpace: "nowrap",
          mr: 1,
          pt: 1,
          pb: 1,
          minHeight: 48,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            minWidth: 60,
            textAlign: "right",
            mr: 1,
          }}
        >
          <Typography variant="h6">{roundedDuration.format("H:mm")}</Typography>
        </Box>
        {product && <DimensionChip dimension="product" label={product} />}
        {activity && <DimensionChip dimension="activity" label={activity} />}
        {issue && <DimensionChip dimension="issue" label={issue} />}
        {client && <DimensionChip dimension="client" label={client} />}
        {description && (
          <Typography
            variant="subtitle2"
            sx={{ overflow: { xs: "visible", md: "hidden" }, textOverflow: "ellipsis" }}
          >
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex" }}>{action}</Box>
    </ListItem>
  );
};

export default EntryListItem;
