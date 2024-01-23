import _dayjs from "dayjs";
import "dayjs/locale/en-gb";
import "dayjs/locale/fi";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";

const dayjs = _dayjs;

dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(utc);

dayjs.locale("fi");

export default dayjs;
