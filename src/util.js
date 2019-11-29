const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const generateRandomArray = (arr) => new Array(getRandomInteger(1, 3)).fill(``).map(() => arr[getRandomInteger(0, arr.length - 1)]);

export {getRandomInteger, generateRandomArray};


// return [...g].filter(() => Math.random() > 0.5).slice(0, getRandomInteger(1, 2));
//
// const getRandomNum = (min, max, NumbersLengthAfterPoint = 0, toRound = false) => {
//   const number = Math.random() * (max - min) + min)
//   return toRound ? Math.round(number) : number.toFixed(numbersLengthAfterPoint);
// };

