import _dayjs from "dayjs";
import "dayjs/locale/en-gb";
import "dayjs/locale/fi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

const dayjs = _dayjs;

dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

dayjs.locale("fi");

export default dayjs;
