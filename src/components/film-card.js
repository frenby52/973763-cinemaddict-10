import {createElement} from "../util";

const getCroppedDescription = (description) => description.length < 140 ? description : `${description.slice(0, 139)}…`;

const createFilmCardTemplate = (data) => {
  const {title, rating, date, runtime, genre, poster, description, comments} = data;
  return (`<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${new Date(date).getFullYear()}</span>
            <span class="film-card__duration">${runtime}</span>
            <span class="film-card__genre">${genre.join(`, `)}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getCroppedDescription(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
          </form>
   </article>`);
};

export default class FilmCard {
  constructor(data) {
    this._card = data;
    this._element = null;
    this._interactiveElementsClassList = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  addElementsClickHandlers(handler) {
    this._interactiveElementsClassList.forEach((it) => this._element.querySelector(it).addEventListener(`click`, handler.bind(this)));
  }
}
