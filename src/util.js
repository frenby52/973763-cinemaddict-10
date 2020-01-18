import moment from "moment";

const ESC_KEYCODE = 27;
const DEBOUNCE_INTERVAL = 500;

const FilterType = {
  ALL: `#all`,
  WATCHLIST: `#watchlist`,
  HISTORY: `#history`,
  FAVORITES: `#favorites`
};

const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const getSortedData = (cards, key) => {
  if (cards.length && Array.isArray(cards[0][key])) {
    return cards.slice().sort((a, b) => b[key].length - a[key].length);
  }
  return cards.slice().sort((a, b) => b[key] - a[key]);
};

const getHighestValuesData = (cards, key) => {
  if (cards.length && Array.isArray(cards[0][key])) {
    return cards.filter((it) => it[key].length === cards[0][key].length);
  }
  return cards.filter((it) => it[key] === cards[0][key]);
};

const getRandomArrayItems = (cards, qty)=> cards.sort(() => Math.random() - 0.5).slice(0, qty);

const createElement = (templateString) => {
  const template = document.createElement(`template`);
  template.innerHTML = templateString;
  return template.content.firstElementChild;
};

const renderComponent = (container, component, place) => (place === `afterbegin`) ? container.prepend(component.getElement()) : container.append(component.getElement());

const isEscEvent = (evt, action) => {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

const getFilmCardsByFilter = (cards, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return cards.filter((it) => it.watchlist);
    case FilterType.HISTORY:
      return cards.filter((it) => it.watched);
    case FilterType.FAVORITES:
      return cards.filter((it) => it.favorite);
  }

  return cards;
};

const getFilmCardsBySort = (cards, sortType) => {
  if (sortType !== `default`) {
    return cards.slice().sort((a, b) => b[sortType] - a[sortType]);
  }
  return cards;
};

const getFilmRuntime = (runtime) => {
  const runtimeMs = runtime * 60 * 1000;
  return `${moment.duration(runtimeMs).hours()}h ${moment.duration(runtimeMs).minutes()}m`;
};

const getUserRank = (rank) => {
  if (rank >= 1 && rank <= 10) {
    return `novice`;
  } else if (rank >= 11 && rank <= 20) {
    return `fan`;
  } else if (rank >= 21) {
    return `movie buff`;
  }
  return ``;
};

export {getSortedData, getHighestValuesData, getRandomArrayItems, createElement, renderComponent, isEscEvent, FilterType, getFilmCardsByFilter, SortType, getFilmCardsBySort, getFilmRuntime, getUserRank, DEBOUNCE_INTERVAL};
