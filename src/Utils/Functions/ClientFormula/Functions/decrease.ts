export default (fArgs, data) => {
  const numberLeft = isNumber(fArgs[0])
    ? parseFloat(fArgs[0])
    : parseFloat(data[fArgs[0]]);
  const numberRight = isNumber(fArgs[1])
    ? parseFloat(fArgs[1])
    : parseFloat(data[fArgs[1]]);

  return numberLeft - numberRight;
};

const isNumber = (number) => !isNaN(number) && !isNaN(parseFloat(number));
