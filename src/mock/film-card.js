import {getRandomInteger, generateRandomArray} from "../util";

const filmTitles = new Set([`Lorem`, `ipsum`, `dolor`, `consectetur`, `adipiscing`, `elit`, `Cras`, `aliquet`, `varius`, `magna`, `non porta`, `ligula`, `feugiat`, `eget`, `Fusce`]);
const genres = new Set([`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`]);
const posters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const description = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];
const directors = new Set([`director one`, `director two`, `director three`]);
const writers = new Set([`writer one`, `writer two`, `writer three`, `writer four`, `writer five`, `writer six`]);
const actors = new Set([`actor one`, `actor two`, `actor three`, `actor four`, `actor five`, `actor six`]);
const countries = new Set([`Russia`, `USA`, `Sweden`, `England`]);
const authors = [`writer one`, `writer two`, `writer three`, `writer four`, `writer five`, `writer six`];
const emoji = new Set([`smile`, `sleeping`, `puke`, `angry`]);

const generateFilmCard = () => ({
  film: {
    title: [...filmTitles][getRandomInteger(0, [...filmTitles].length - 1)],
    originalTitle: [...filmTitles][getRandomInteger(0, [...filmTitles].length - 1)],
    rating: getRandomInteger(0, 10),
    poster: posters[getRandomInteger(0, posters.length - 1)],
    age: getRandomInteger(0, 21),
    director: [...directors][getRandomInteger(0, [...directors].length - 1)],
    writers: generateRandomArray([...writers]).join(`, `),
    actors: generateRandomArray([...actors]).join(`, `),
    date: getRandomInteger(0, 29) * 365 * 24 * 3600 * 1000,
    country: [...countries][getRandomInteger(0, [...countries].length - 1)],
    runtime: `${getRandomInteger(0, 2)}h ${getRandomInteger(0, 60)}m`,
    genre: generateRandomArray([...genres]),
    description: generateRandomArray(description).join(` `),
    watchlist: Math.random() > 0.5,
    history: Math.random() > 0.5,
    favorites: Math.random() > 0.5
  },
  comments: generateComments(getRandomInteger(0, description.length - 1))
});

const generateComment = () => ({
  author: authors[getRandomInteger(0, authors.length - 1)],
  comment: generateRandomArray(description).join(` `),
  date: getRandomInteger(0, 29) * 365 * 24 * 3600 * 1000,
  emoji: [...emoji][getRandomInteger(0, [...emoji].length - 1)]
});

const generateComments = (qty) => new Array(qty).fill(``).map(generateComment);

const generateFilmCards = (qty) => new Array(qty).fill(``).map(generateFilmCard);

export {generateFilmCards};

