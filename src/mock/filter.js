import {getRandomInteger} from "../util";

const generateFilters = () => ({
  watchlist: getRandomInteger(0, 100),
  history: getRandomInteger(0, 100),
  favorites: getRandomInteger(0, 100)
});

export {generateFilters};
