const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

const getDifference = (num1: number, num2: number) => {
  return Math.abs(num1 - num2);
};

export const Utils = {
  getDifference,
  getRandomInt,
};
