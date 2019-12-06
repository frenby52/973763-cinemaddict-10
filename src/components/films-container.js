import AbstractComponent from "./abstract-component";

const createFilmsContainerTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
      <button class="films-list__show-more">Show more</button>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`;

export default class FilmsContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsContainerTemplate();
  }

  showNoMoviesMessage() {
    const title = this._element.querySelector(`.films-list__title`);
    title.classList.remove(`visually-hidden`);
    title.textContent = `There are no movies in our database`;
  }

  getShowMoreBtnElement() {
    return this._element.querySelector(`.films-list__show-more`);
  }

  removeShowMoreBtn() {
    this.getShowMoreBtnElement().remove();
  }

  addShowMoreBtnClickHandler(handler) {
    if (this.getShowMoreBtnElement()) {
      this.getShowMoreBtnElement().addEventListener(`click`, handler);
    }
  }
}
