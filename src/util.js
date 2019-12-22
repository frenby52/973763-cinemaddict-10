const ESC_KEYCODE = 27;

const FilterType = {
  ALL: `#all`,
  WATCHLIST: `#watchlist`,
  HISTORY: `#history`,
  FAVORITES: `#favorites`
};

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const generateRandomArray = (arr, min = 1, max = 3) => new Array(getRandomInteger(min, max)).fill(``).map(() => arr[getRandomInteger(0, arr.length - 1)]);

const getSortedData = (data, key) => {
  if (data.length && Array.isArray(data[0][key])) {
    return data.slice().sort((a, b) => b[key].length - a[key].length);
  }
  return data.slice().sort((a, b) => b[key] - a[key]);
};

const getHighestValuesData = (data, key) => {
  if (data.length && Array.isArray(data[0][key])) {
    return data.filter((it) => it[key].length === data[0][key].length);
  }
  return data.filter((it) => it[key] === data[0][key]);
};

const getRandomArrayItems = (data, qty)=> data.sort(() => Math.random() - 0.5).slice(0, qty);

const createElement = (templateString) => {
  const template = document.createElement(`template`);
  template.innerHTML = templateString;
  return template.content.firstElementChild;
};

const renderComponent = (container, component, place) => (place === `afterbegin`) ? container.prepend(component.getElement()) : container.append(component.getElement());

// const replaceComponent = (newComponent, oldComponent) => {
//   const parentElement = oldComponent.getElement().parentElement;
//   const newElement = newComponent.getElement();
//   const oldElement = oldComponent.getElement();
//
//   const isExistElements = !!(parentElement && newElement && oldElement);
//
//   if (isExistElements && parentElement.contains(oldElement)) {
//     parentElement.replaceChild(newElement, oldElement);
//   }
// };

const isEscEvent = (evt, action) => {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

const getFilmCardsByFilter = (data, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return data.filter((it) => it.watchlist);
    case FilterType.HISTORY:
      return data.filter((it) => it.watched);
    case FilterType.FAVORITES:
      return data.filter((it) => it.favorite);
  }

  return data;
};

export {getRandomInteger, generateRandomArray, getSortedData, getHighestValuesData, getRandomArrayItems, createElement, renderComponent, isEscEvent, FilterType, getFilmCardsByFilter};
