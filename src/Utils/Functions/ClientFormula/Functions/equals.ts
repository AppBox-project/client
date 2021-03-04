import { get } from "lodash";

export default (fArgs, data) => {
  const left = fArgs[0].str ? fArgs[0].str : get(data, fArgs[0]);
  const right = fArgs[1].str ? fArgs[1].str : get(data, fArgs[0]);
  return left === right;
};
