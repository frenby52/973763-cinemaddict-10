import AbstractSmartComponent from "./abstract-smart-component";
import {getFilmRuntime, DEBOUNCE_INTERVAL} from "../util";
import {debounce} from "debounce";

const getCroppedDescription = (description) => description.length < 140 ? description : `${description.slice(0, 139)}…`;

const createFilmCardTemplate = (card) => {
  const {title, rating, date, runtime, genre, poster, description, comments, watchlist, watched, favorite} = card;
  return (`<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${new Date(date).getFullYear()}</span>
            <span class="film-card__duration">${getFilmRuntime(runtime)}</span>
            <span class="film-card__genre">${[...genre].join(`, `)}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getCroppedDescription(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button type="button" class="film-card__controls-item button film-card__controls-item--add-to-watchlist  ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button type="button" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button type="button" class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
          </form>
   </article>`);
};

export default class FilmCard extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._data = card;
    this._elementsClickHandlers = null;
    this._watchlistButtonClickHandler = null;
    this._watchedButtonClickHandler = null;
    this._favoritesButtonClickHandler = null;
    this._interactiveElementsClassList = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];
  }

  getTemplate() {
    return createFilmCardTemplate(this._data);
  }

  getWatchlistButtonElement() {
    return this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`);
  }

  getWatchedButtonElement() {
    return this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`);
  }

  getFavoritesButtonElement() {
    return this.getElement().querySelector(`.film-card__controls-item--favorite`);
  }

  setElementsClickHandlers(handler) {
    this._elementsClickHandlers = handler;
    this._interactiveElementsClassList.forEach((it) => this._element.querySelector(it).addEventListener(`click`, handler));
  }

  setWatchlistButtonClickHandler(handler) {
    this._watchlistButtonClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getWatchlistButtonElement().addEventListener(`click`, this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(handler) {
    this._watchedButtonClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getWatchedButtonElement().addEventListener(`click`, this._watchedButtonClickHandler);
  }

  setFavoritesButtonClickHandler(handler) {
    this._favoritesButtonClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getFavoritesButtonElement().addEventListener(`click`, this._favoritesButtonClickHandler);
  }

  rerender(card) {
    this._data = card;
    super.rerender();
  }

  recoveryListeners() {
    this._interactiveElementsClassList.forEach((it) => this._element.querySelector(it).addEventListener(`click`, this._elementsClickHandlers));
    this.getWatchlistButtonElement().addEventListener(`click`, this._watchlistButtonClickHandler);
    this.getWatchedButtonElement().addEventListener(`click`, this._watchedButtonClickHandler);
    this.getFavoritesButtonElement().addEventListener(`click`, this._favoritesButtonClickHandler);
  }
}
