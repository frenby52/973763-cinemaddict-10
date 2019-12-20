import {FilterType, getFilmCardsByFilter, renderComponent, replaceComponent} from "../util";
import SiteMenuComponent from "../components/site-menu";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    // this._activeFilterType = FilterType.ALL;
    this._siteMenuComponent = null;

    // this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    // //
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    // const container = this._container;
    const allCards = this._moviesModel.getCardsAll();

    // const filters = Object.values(FilterType).map((filterType) => {
    //   return {
    //     name: filterType,
    //     count: getFilmCardsByFilter(allCards, filterType).length,
    //     active: filterType === this._activeFilterType,
    //   };
    // });


    const filters = Object.values(FilterType).map((filterType) => getFilmCardsByFilter(allCards, filterType).length);



    const oldComponent = this._siteMenuComponent;
    this._siteMenuComponent = new SiteMenuComponent(filters);
    this._siteMenuComponent.setFilterClickHandler(this._onFilterChange);


    if (oldComponent) {
      replaceComponent(this._siteMenuComponent, oldComponent);
      console.log(this._siteMenuComponent.getElement())
    } else {
      renderComponent(this._container, this._siteMenuComponent);
    }
  }

  _onFilterChange(filterType) {
    console.log(filterType)
    // this._siteMenuComponent.getElement().querySelector(filterType).addEventListener(`click`, handler)
    // this.render(); // переделать на ререндер
    this._moviesModel.activateFilter(filterType);
    // this._activeFilterType = filterType;

  }

  // // //
  _onDataChange() {
    this.render();
  }
}
