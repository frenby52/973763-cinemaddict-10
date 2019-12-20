import {FilterType, getFilmCardsByFilter} from "../util";

export default class Movies {
  constructor() {
    this._cards = [];

    this._filterChangeHandler = null;
    this._activeFilterType = FilterType.ALL;

    // // //
    this._dataChangeHandler = [];

  }

  getCards() {
    return getFilmCardsByFilter(this._cards, this._activeFilterType);
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
      // return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    // const sameMovieControllers = this._showedMovieControllers.filter((it) => it.data.id === id);
    // // sameMovieControllers.forEach((it)=> it.rerender(this._cards[index]));
    // sameMovieControllers.forEach((it)=> it.rerender(newData));

    // // //
    console.log(this._dataChangeHandler)
    // this._dataChangeHandlers.forEach((handler) => handler());
    this._dataChangeHandler();
    return true;
  }

  // _setFilterChangeHandler() {}
  activateFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandler();
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
  }


  // // //
  setDataChangeHandler(handler) {
    // this._dataChangeHandlers.push(handler);
    this._dataChangeHandler = handler;
  }

}
