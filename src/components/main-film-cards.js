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

  getShowMoreBtnElement() {
    return this.getElement().querySelector(`.films-list__show-more`);
  }

  showNoMoviesMessage() {
    const titleElement = this._element.querySelector(`.films-list__title`);
    titleElement.classList.remove(`visually-hidden`);
    titleElement.textContent = `There are no movies in our database`;
  }

  restoreDefaultTitle() {
    const titleElement = this._element.querySelector(`.films-list__title`);
    if (!titleElement.classList.contains(`visually-hidden`)) {
      titleElement.classList.add(`visually-hidden`);
      titleElement.textContent = `All movies. Upcoming`;
    }
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
