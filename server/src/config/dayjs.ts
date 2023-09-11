import _dayjs from "dayjs";
import Utc from "dayjs/plugin/utc";

const dayjs = _dayjs;
dayjs.extend(Utc);

export default dayjs;
