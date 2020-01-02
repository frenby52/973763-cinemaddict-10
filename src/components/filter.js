import AbstractSmartComponent from "./abstract-smart-component";
import {FilterType} from "../util";

const createFilterTemplate = (data) => {
  const [all, watchlist, history, favorites] = data;
  return (`<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${all.active ? `main-navigation__item--active` : ``}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${watchlist.active ? `main-navigation__item--active` : ``} ">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
    <a href="#history" class="main-navigation__item ${history.active ? `main-navigation__item--active` : ``}">History <span class="main-navigation__item-count">${history.count}</span></a>
    <a href="#favorites" class="main-navigation__item ${favorites.active ? `main-navigation__item--active` : ``}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`);
};

export default class Filter extends AbstractSmartComponent {
  constructor(data) {
    super();
    this._data = data;
    this._filterType = null;
    this._filterClickHandler = null;
    this._statsClickHandler = null;
  }

  getTemplate() {
    return createFilterTemplate(this._data);
  }

  rerender(data) {
    this._data = data;
    super.rerender();
  }

  _removeActiveClass() {
    const filterElements = Array.from(this.getElement().querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`));
    const AllFilterElementIndex = filterElements.findIndex((it) => it.getAttribute(`href`) === FilterType.ALL);
    const activeFilterElementIndex = filterElements.findIndex((it) => it.getAttribute(`href`) === this._filterType);
    if (this._filterType) {
      filterElements[activeFilterElementIndex].classList.remove(`main-navigation__item--active`);
    } else {
      filterElements[AllFilterElementIndex].classList.remove(`main-navigation__item--active`);
    }
  }

  setFilterAndStatsClickHandlers(filterClickHandler, statsClickHandler) {
    this._filterClickHandler = filterClickHandler;
    this._statsClickHandler = statsClickHandler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const statsElement = this.getElement().querySelector(`.main-navigation__item--additional`);
      if (evt.target.classList.contains(`main-navigation__item`) && evt.target.getAttribute(`href`) !== this._filterType && !evt.target.classList.contains(`main-navigation__item--additional`)) {
        statsElement.classList.remove(`main-navigation__item--active`);
        this._removeActiveClass();
        this._filterType = evt.target.getAttribute(`href`);
        evt.target.classList.add(`main-navigation__item--active`);
        filterClickHandler(this._filterType);
        statsClickHandler(false);
      } else if (evt.target.classList.contains(`main-navigation__item--additional`) && !evt.target.classList.contains(`main-navigation__item--active`)) {
        this._removeActiveClass();
        evt.target.classList.add(`main-navigation__item--active`);
        statsClickHandler(true);
        this._filterType = null;
      }
    });
  }

  recoveryListeners() {
    this.setFilterAndStatsClickHandlers(this._filterClickHandler, this._statsClickHandler);
  }
}
