import AbstractComponent from "./abstract-component";

const createExtraFilmCardsTemplate = (title) =>
  `<section class="films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;

export default class ExtraFilmCards extends AbstractComponent {
  constructor(title) {
    super();

    this._title = title;
  }

  getTemplate() {
    return createExtraFilmCardsTemplate(this._title);
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
