import { Box, ListItem, ListItemProps, Typography } from "@mui/material";
import dayjs from "dayjs";
import { roundToFullMinutes } from "../../../common/duration";
import { AcceptanceStatus, EntryTemplateType, Entry } from "../../../graphql/generated/graphql";
import DimensionChip from "./DimensionChip";
import { ReactNode } from "react";

type MobileEntryListItemProps = {
  entry: EntryTemplateType | Entry;
  action: ReactNode;
} & ListItemProps;

const isEntry = (value: EntryTemplateType | Entry): value is Entry => "acceptanceStatus" in value;

const MobileEntryListItem = ({ entry, action, ...listItemProps }: MobileEntryListItemProps) => {
  const { product, activity, issue, client, description } = entry;

  const acceptanceStatus = isEntry(entry) ? entry.acceptanceStatus : undefined;
  const typeName = isEntry(entry) ? entry.typeName : undefined;

  const accepted = acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = acceptanceStatus === AcceptanceStatus.Paid;
  const open = acceptanceStatus === AcceptanceStatus.Open;
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
        flexDirection: "column",
        alignItems: "stretch",
        ...listItemProps.sx,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", minHeight: 40 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            minWidth: 50,
            mr: 1,
          }}
        >
          <Typography variant="h6">{roundedDuration.format("H:mm")}</Typography>
        </Box>
        <Box sx={{ display: "flex" }}>{action}</Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          mr: 1,
          pb: 1,
          minHeight: 48,
        }}
      >
        {product && <DimensionChip dimension="product" label={product} />}
        {activity && <DimensionChip dimension="activity" label={activity} />}
        {issue && <DimensionChip dimension="issue" label={issue} />}
        {client && <DimensionChip dimension="client" label={client} />}
        {(paid || open || accepted) && !product && !activity && !issue && !client && typeName && (
          <Typography variant="subtitle1" sx={{ width: "100%", mt: 1, ml: 1 }}>
            {typeName}
          </Typography>
        )}
        {description && (
          <Typography variant="subtitle2" sx={{ width: "100%", mt: 1, ml: 1 }}>
            {description}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
};

export default MobileEntryListItem;
