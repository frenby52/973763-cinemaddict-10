import AbstractComponent from "./abstract-component";

const sortTypes = {
  default: `default`,
  date: `date`,
  rating: `rating`
};

const createSortTemplate = () =>
  `<ul class="sort">
    <li><a href="#" data-sort-type="${sortTypes.default}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${sortTypes.date}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${sortTypes.rating}" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._sortType = sortTypes.default;
  }

  getTemplate() {
    return createSortTemplate();
  }

  addSortHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A` && evt.target.getAttribute(`data-sort-type`) !== this._sortType) {
        this._sortType = sortTypes[evt.target.getAttribute(`data-sort-type`)];
        handler(this._sortType);
      }
    });
  }

  getSortedData(data) {
    if (this._sortType !== sortTypes.default) {
      return data.slice().sort((a, b) => b[this._sortType] - a[this._sortType]);
    }
    return data;
  }
}
