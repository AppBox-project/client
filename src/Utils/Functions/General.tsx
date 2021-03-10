export const remove = (array, id) => {
  return array.some((o, i, a) =>
    o.id === id ? a.splice(i, 1) : remove(o.items || [], id)
  );
};

export const updateById = (array, newItem) => {
  (array || []).forEach(update(newItem.id, newItem));
};

let update = (id, newItem) => (obj) => {
  if (obj.id === id) {
    obj = newItem;
    return true;
  } else if (obj.items) return obj.items.some(update(id, newItem));
};
