import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("id");

type daysParams = [
  date?: string | number | dayjs.Dayjs | Date | null | undefined,
  format?: dayjs.OptionType | undefined,
  locale?: string | undefined,
  strict?: boolean | undefined
];

export default function days(...params: daysParams) {
  return dayjs(params[0], params[1], params[2], params[3]).locale("id");
}
