import {renderComponent} from "../util";
import SortComponent from "../components/sort";

export default class SortController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._sortComponent = null;

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    this._sortComponent = new SortComponent();
    this._sortComponent.setSortTypeChangeHandler(this._onSortChange);
    renderComponent(this._container, this._sortComponent);
  }

  _onSortChange(sortType) {
    this._moviesModel.activateSort(sortType);
  }
}
