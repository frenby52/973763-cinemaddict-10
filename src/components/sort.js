import AbstractComponent from "./abstract-component";

const createSortTemplate = () =>
  `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._sortType = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`sort__button`) && evt.target.getAttribute(`data-sort-type`) !== this._sortType) {
        const sortElements = Array.from(this.getElement().querySelectorAll(`.sort__button`));
        const defaultSortElementIndex = sortElements.findIndex((it) => it.getAttribute(`data-sort-type`) === `default`);
        const activeSortElementIndex = sortElements.findIndex((it) => it.getAttribute(`data-sort-type`) === this._sortType);
        if (this._sortType) {
          sortElements[activeSortElementIndex].classList.remove(`sort__button--active`);
        } else {
          sortElements[defaultSortElementIndex].classList.remove(`sort__button--active`);
        }
        this._sortType = evt.target.getAttribute(`data-sort-type`);
        evt.target.classList.add(`sort__button--active`);
        handler(this._sortType);
      }
    });
  }

  // getSortedData(data) {
  //   if (this._sortType !== `default`) {
  //     return data.slice().sort((a, b) => b[this._sortType] - a[this._sortType]);
  //   }
  //   return data;
  // }
}
