import AbstractComponent from "./abstract-component";

const createFilmsContainerTemplate = () => `<section class="films"></section>`;

export default class FilmsContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
