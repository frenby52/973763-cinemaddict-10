import {FilterType, getFilmCardsByFilter, SortType, getFilmCardsBySort} from "../util";

export default class Movies {
  constructor() {
    this._cards = [];

    this._dataChangeHandlers = [];
    this._activeFilterType = FilterType.ALL;
    this._activeSortType = SortType.DEFAULT;
    this._sortAndFilterChangeHandler = null;
  }

  getCards() {
    const filteredData = getFilmCardsByFilter(this._cards, this._activeFilterType);
    return getFilmCardsBySort(filteredData, this._activeSortType);
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = cards;
  }

  updateCard(id, newData) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());
    return true;
  }

  activateFilter(filterType) {
    this._activeFilterType = filterType;
    if (this._sortAndFilterChangeHandler) {
      this._sortAndFilterChangeHandler();
    }
  }

  activateSort(sortType) {
    this._activeSortType = sortType;
    if (this._sortAndFilterChangeHandler) {
      this._sortAndFilterChangeHandler();
    }
  }

  setSortAndFilterChangeHandler(handler) {
    this._sortAndFilterChangeHandler = handler;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
