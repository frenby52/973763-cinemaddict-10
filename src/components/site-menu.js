import AbstractComponent from "./abstract-component";
import {FilterType} from "../util";

const createSiteMenuTemplate = (data) => {
  const [, watchlist, history, favorites] = data;
  // console.log(all.active)
  const watchlistFilmCards = data.filter((it) => it.watchlist);
  const historyFilmCards = data.filter((it) => it.watched);
  const favoritesFilmCards = data.filter((it) => it.favorite);
  return (`<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`);
};

export default class SiteMenu extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
    this._filterType = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._data);
  }

  setFilterClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`main-navigation__item`) && evt.target.getAttribute(`href`) !== this._filterType && !evt.target.classList.contains(`main-navigation__item--additional`)) {
        const filterElements = Array.from(this.getElement().querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`));
        const AllFilterElementIndex = filterElements.findIndex((it) => it.getAttribute(`href`) === FilterType.ALL);
        const activeFilterElementIndex = filterElements.findIndex((it) => it.getAttribute(`href`) === this._filterType);
        if (this._filterType) {
          filterElements[activeFilterElementIndex].classList.remove(`main-navigation__item--active`);
        } else {
          filterElements[AllFilterElementIndex].classList.remove(`main-navigation__item--active`);
        }
        this._filterType = evt.target.getAttribute(`href`);
        evt.target.classList.add(`main-navigation__item--active`);
        handler(this._filterType);
      }
    });
  }
}
