import {getRandomInteger, generateRandomArray} from "../util";

const filmTitles = new Set([`Lorem`, `ipsum`, `dolor`, `consectetur`, `adipiscing`, `elit`, `Cras`, `aliquet`, `varius`, `magna`, `non porta`, `ligula`, `feugiat`, `eget`, `Fusce`]);
const genres = new Set([`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`]);
const posters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const description = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const generateFilmCard = () => ({
  title: [...filmTitles][getRandomInteger(0, [...filmTitles].length - 1)],
  rating: getRandomInteger(0, 10),
  year: getRandomInteger(1920, 2020),
  duration: `${getRandomInteger(0, 2)}h ${getRandomInteger(0, 60)}m`,
  // genre: [...genres][getRandomInteger(0, [...genres].length - 1)],
  genre: generateRandomArray([...genres]).join(`, `),
  poster: posters[getRandomInteger(0, posters.length - 1)],
  description: generateRandomArray(description).join(` `),
  // description: new Array(getRandomInteger(1, 3)).fill(``).map(() => description[getRandomInteger(0, description.length - 1)]).join(` `),
  comments: getRandomInteger(0, 100)
});

const generateFilmCards = (qty) => new Array(qty).fill(``).map(generateFilmCard);

export {generateFilmCards};

