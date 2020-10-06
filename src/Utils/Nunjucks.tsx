import { differenceInCalendarYears, parse, format } from "date-fns";
var n = require("nunjucks");
let nunjucks = n.configure();

nunjucks.addGlobal("differenceInYears", (a, b) => {
  return differenceInCalendarYears(new Date(a), new Date(b));
});

nunjucks.addFilter("date", (date, dateFormat) => {
  return format(date, dateFormat);
});

nunjucks.addFilter("years", (time) => time / 31536000000);

export default nunjucks;
