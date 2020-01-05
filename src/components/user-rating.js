import AbstractSmartComponent from "./abstract-smart-component";
import {getUserRank} from "../util";

const createUserRatingTemplate = (moviesModel) => {
  const rank = moviesModel.getCardsAll().filter((it) => it.watched).length;
  return (`<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(rank)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class UserRating extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createUserRatingTemplate(this._moviesModel);
  }

  _onDataChange() {
    this.rerender();
  }

  recoveryListeners() {}
}
