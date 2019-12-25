import AbstractComponent from "./abstract-component";
import {createElement} from "../util";

const createMainFilmCardsTemplate = () =>
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
      <button class="films-list__show-more">Show more</button>
    </section>`;

export default class MainFilmCards extends AbstractComponent {
  constructor() {
    super();

    this._showMoreBtnClickHandler = null;
  }

  getTemplate() {
    return createMainFilmCardsTemplate();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  showNoMoviesMessage() {
    const title = this._element.querySelector(`.films-list__title`);
    title.classList.remove(`visually-hidden`);
    title.textContent = `There are no movies in our database`;
  }

  restoreDefaultTitle() {
    const title = this._element.querySelector(`.films-list__title`);
    if (!title.classList.contains(`visually-hidden`)) {
      title.classList.add(`visually-hidden`);
      title.textContent = `All movies. Upcoming`;
    }
  }

  getShowMoreBtnElement() {
    return this.getElement().querySelector(`.films-list__show-more`);
  }

  renderShowMoreBtn() {
    if (!this.getShowMoreBtnElement()) {
      const showMoreBtnTemplate = `<button class="films-list__show-more">Show more</button>`;
      const showMoreBtn = createElement(showMoreBtnTemplate);
      this.getContainer().append(showMoreBtn);
      showMoreBtn.addEventListener(`click`, this._showMoreBtnClickHandler);
    }
  }

  removeShowMoreBtn() {
    if (this.getShowMoreBtnElement()) {
      this.getShowMoreBtnElement().remove();
    }
  }

  setShowMoreBtnClickHandler(handler) {
    if (this.getShowMoreBtnElement()) {
      this._showMoreBtnClickHandler = handler;
      this.getShowMoreBtnElement().addEventListener(`click`, handler);
    }
  }
}
