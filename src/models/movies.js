import {FilterType, getFilmCardsByFilter, SortType, getFilmCardsBySort} from "../util";

export default class Movies {
  constructor() {
    this._cards = [];

    this._filterChangeHandler = null;
    this._dataChangeHandler = null;
    this._activeFilterType = FilterType.WATCHLIST;
    this._activeSortType = SortType.DEFAULT;
    this._sortChangeHandler = null;
  }

  getCards() {
    // return getFilmCardsByFilter(this._cards, this._activeFilterType);
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
    this._dataChangeHandler();
    return true;
  }

  activateFilter(filterType) {
    this._activeFilterType = filterType;
    if (this._filterChangeHandler) {
      this._filterChangeHandler();
    }
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
  }

  activateSort(sortType) {
    this._activeSortType = sortType;
    if (this._sortChangeHandler) {
      this._sortChangeHandler();
    }
  }

  setSortChangeHandler(handler) {
    this._sortChangeHandler = handler;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandler = handler;
  }

}
