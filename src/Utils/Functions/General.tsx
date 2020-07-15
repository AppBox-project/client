export const remove = (array, id) => {
  return array.some((o, i, a) =>
    o.id === id ? a.splice(i, 1) : remove(o.items || [], id)
  );
};
