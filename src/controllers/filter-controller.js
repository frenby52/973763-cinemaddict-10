import {FilterType, getFilmCardsByFilter, renderComponent} from "../util";
import SiteMenuComponent from "../components/site-menu";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._siteMenuComponent = null;

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

    this._siteMenuComponent = new SiteMenuComponent(filters);
    this._siteMenuComponent.setFilterClickHandler(this._onFilterChange);
    renderComponent(this._container, this._siteMenuComponent);
  }

  rerender() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmCardsByFilter(this._moviesModel.getCardsAll(), filterType).length,
        active: filterType === this._activeFilterType,
      };
    });

    this._siteMenuComponent.rerender(filters);
  }

  _onFilterChange(filterType) {
    this._moviesModel.activateFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.rerender();
  }
}
