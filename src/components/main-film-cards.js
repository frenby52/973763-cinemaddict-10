import AbstractComponent from "./abstract-component";

const createMainFilmCardsTemplate = () =>
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
      <button class="films-list__show-more">Show more</button>
    </section>`;

export default class MainFilmCards extends AbstractComponent {
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

  getShowMoreBtnElement() {
    return this.getElement().querySelector(`.films-list__show-more`);
  }

  removeShowMoreBtn() {
    this.getShowMoreBtnElement().remove();
  }

  setShowMoreBtnClickHandler(handler) {
    if (this.getShowMoreBtnElement()) {
      this.getShowMoreBtnElement().addEventListener(`click`, handler);
    }
  }
}
