import { Box, ListItem, ListItemProps, Typography } from "@mui/material";
import dayjs from "dayjs";
import { roundToFullMinutes } from "../../../common/duration";
import { AcceptanceStatus, EntryTemplateType, Entry } from "../../../graphql/generated/graphql";
import DimensionChip from "./DimensionChip";
import { ReactNode } from "react";

type EntryListItemProps = {
  entry: EntryTemplateType | Entry;
  action: ReactNode;
} & ListItemProps;

const isEntry = (value: EntryTemplateType | Entry): value is Entry => "acceptanceStatus" in value;

const EntryListItem = ({ entry, action, ...listItemProps }: EntryListItemProps) => {
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
          <Typography component="h4" variant="h6">
            {roundedDuration.format("H:mm")}
          </Typography>
        </Box>
        {product && <DimensionChip dimension="product" label={product} />}
        {activity && <DimensionChip dimension="activity" label={activity} />}
        {issue && <DimensionChip dimension="issue" label={issue} />}
        {client && <DimensionChip dimension="client" label={client} />}
        {(paid || open || accepted) && !product && !activity && !issue && !client && typeName && (
          <Typography
            component="h5"
            variant="subtitle1"
            sx={{ overflow: { xs: "visible", md: "hidden" }, textOverflow: "ellipsis" }}
          >
            {typeName}
          </Typography>
        )}
        {description && (
          <Typography
            component="h5"
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
