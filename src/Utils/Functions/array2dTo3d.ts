import get from "lodash/get";
import filter from "lodash/filter";
import sortByFunc from "lodash/sortBy";

// This function transforms a 2d array with a property to indicate it's parent into a recursive array with limitless subItems
const array2dTo3d = (
  array,
  property,
  transformToList: Boolean = false,
  transformToListTitle: string = "unknown",
  sortBy: string[] = []
) => {
  let result = [];
  if (sortBy.length > 0) array = sortByFunc(array, sortBy);

  array.map((obj) => {
    if (!get(obj, property)) {
      // Root level
      const children = findChildren(
        array,
        property,
        obj._id,
        transformToList,
        transformToListTitle
      );
      transformToList
        ? result.push({
            label: get(obj, transformToListTitle),
            id: obj._id,
            subItems: children,
          })
        : result.push(obj);
    }
  });
  return result;
};

const findChildren = (
  array,
  property,
  id,
  transformToList: Boolean = false,
  transformToListTitle: string = "unknown"
) => {
  const result = [];
  filter(array, (o) => get(o, property) === id).map((o) => {
    const children = findChildren(
      array,
      property,
      o._id,
      transformToList,
      transformToListTitle
    );

    transformToList
      ? result.push({
          label: get(o, transformToListTitle),
          id: o._id,
          subItems: children,
        })
      : result.push(o);
  });
  return result;
};
export default array2dTo3d;
