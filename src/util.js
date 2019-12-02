const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const generateRandomArray = (arr, min = 1, max = 3) => new Array(getRandomInteger(min, max)).fill(``).map(() => arr[getRandomInteger(0, arr.length - 1)]);

const getArrayItemsSum = (data, tmpArr) => tmpArr.reduce((sum, current) => sum + current, 0);

export {getRandomInteger, generateRandomArray, getArrayItemsSum};
