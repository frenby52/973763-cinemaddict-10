import {FilterType, getFilmCardsByFilter, renderComponent} from "../util";
import FilterComponent from "../components/filter";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterComponent = null;
    this._statsClickHandler = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
    this._activeFilterType = FilterType.ALL;
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmCardsByFilter(this._moviesModel.getCardsAll(), filterType).length,
        active: filterType === this._activeFilterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterAndStatsClickHandlers(this._onFilterChange, this._statsClickHandler);
    renderComponent(this._container, this._filterComponent);
  }

  rerender() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmCardsByFilter(this._moviesModel.getCardsAll(), filterType).length,
        active: filterType === this._activeFilterType,
      };
    });

    this._filterComponent.rerender(filters);
  }

  _onFilterChange(filterType) {
    this._moviesModel.activateFilter(filterType);
    this._activeFilterType = filterType;
  }

  setStatsClickHandler(handler) {
    this._statsClickHandler = handler;
  }

  _onDataChange() {
    this.rerender();
  }
}
