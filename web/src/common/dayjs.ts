import _dayjs from "dayjs";
import "dayjs/locale/en-gb";
import "dayjs/locale/fi";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

const dayjs = _dayjs;

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale("fi");

export default dayjs;
