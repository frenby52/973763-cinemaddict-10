import {createElement} from "../util";

const getUserRank = (rank) => {
  if (rank >= 1 && rank <= 10) {
    return `novice`;
  } else if (rank >= 11 && rank <= 20) {
    return `fan`;
  } else if (rank >= 21) {
    return `movie buff`;
  }
  return ``;
};

const createUserRatingTemplate = (data) => {
  const rank = getUserRank(data);
  return (`<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class UserRating {
  constructor(data) {
    this._userRating = data;
    this._element = null;
  }

  getTemplate() {
    return createUserRatingTemplate(this._userRating);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
