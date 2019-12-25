import {SortType, getFilmCardsBySort, renderComponent} from "../util";
import SortComponent from "../components/sort";

export default class SortController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._sortComponent = null;

    // this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    // this._onDataChange = this._onDataChange.bind(this);
    // this._moviesModel.setDataChangeHandler(this._onDataChange);
    this._activeSortType = SortType.DEFAULT;
  }

  render() {
    // const sortData = Object.values(SortType).map((sortType) => {
    //   return {
    //     name: sortType,
    //     count: getFilmCardsBySort(this._moviesModel.getCardsAll(), sortType).length,
    //     active: sortType === this._activeSortType,
    //   };
    // });

    this._sortComponent = new SortComponent();
    this._sortComponent.setSortTypeChangeHandler(this._onSortChange);
    renderComponent(this._container, this._sortComponent);
  }

  // rerender() {
  //   const sortData = Object.values(SortType).map((sortType) => {
  //     return {
  //       name: sortType,
  //       count: getFilmCardsBySort(this._moviesModel.getCardsAll(), sortType).length,
  //       active: sortType === this._activeSortType,
  //     };
  //   });
  //
  //   this._sortComponent.rerender(sortData);
  // }

  _onSortChange(sortType) {
    // this._moviesModel.activateFilter(filterType);
    this._moviesModel.activateSort(sortType);
    this._activeSortType = sortType;
  }

  // _onDataChange() {
  //   this.rerender();
  // }
}
