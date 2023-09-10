import _dayjs from "dayjs";
import "dayjs/locale/fi";
import weekday from "dayjs/plugin/weekday";

const dayjs = _dayjs;

dayjs.extend(weekday);
dayjs.locale("fi");

export default dayjs;
