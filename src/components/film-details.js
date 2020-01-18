import AbstractSmartComponent from "./abstract-smart-component";
import {createElement, getFilmRuntime, DEBOUNCE_INTERVAL} from "../util";
import moment from "moment";
import he from "he";
import {debounce} from "debounce";

const formatReleaseDate = (date) => moment(date).format(`DD MMMM YYYY`);

const createGenresMarkup = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

const createCommentsMarkup = (comments) => comments.map((comment) =>
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji">
    </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
      <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
    </p>
  </div> 
  </li>`).join(`\n`);

const createFilmRatingTemplate = (poster, title, personalRating) => {
  return (`<section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${personalRating === 1 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${personalRating === 2 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${personalRating === 3 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${personalRating === 4 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${personalRating === 5 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${personalRating === 6 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${personalRating === 7 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${personalRating === 8 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${personalRating === 9 ? `checked` : ``}>
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>`);
};

const createFilmDetailsTemplate = (data, comments) => {
  const {title, originalTitle, rating, poster, age, director, writers, actors, date, country, runtime, genre, description, watchlist, watched, favorite, personalRating} = data;
  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get" tabindex="1">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${[...writers]}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${[...actors]}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatReleaseDate(date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getFilmRuntime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${[...genre].length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">${createGenresMarkup([...genre])}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="form-details__middle-container">${watched ? createFilmRatingTemplate(poster, title, personalRating) : ``}</div>
    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${comments ? createCommentsMarkup(comments) : ``}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>

</section>`);
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(data, comments) {
    super();

    this._data = data;
    this._comments = comments;
    this._subscribeOnEvents();
    this._emojiSrc = null;
    this._closeBtnClickHandler = null;
    this._watchlistInputClickHandler = null;
    this._watchedInputClickHandler = null;
    this._favoriteInputClickHandler = null;
    this._deleteCommentsButtonClickHandler = null;
    this._commentSubmitHandler = null;
    this._keyDowHandler = null;
    this._userRatingResetHandler = null;
    this._userRatingClickHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._comments);
  }

  setCloseBtnClickHandler(handler) {
    this._closeBtnClickHandler = handler;
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  setWatchlistInputClickHandler(handler) {
    this._watchlistInputClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._watchlistInputClickHandler);
  }

  setWatchedInputClickHandler(handler) {
    this._watchedInputClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._watchedInputClickHandler);
  }

  setFavoritesInputClickHandler(handler) {
    this._favoriteInputClickHandler = debounce(handler, DEBOUNCE_INTERVAL);
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._favoriteInputClickHandler);
  }

  setDeleteCommentsButtonClickHandler(handler) {
    this._deleteCommentsButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, handler);
  }

  setCommentSubmitHandler(handler) {
    this._commentSubmitHandler = handler;
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`submit`, handler);
  }

  setKeyDownHandler(handler) {
    this._keyDowHandler = handler;
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`keydown`, handler);
  }

  getForm() {
    return this.getElement().querySelector(`.film-details__inner`);
  }

  getFormData() {
    const form = this.getForm();

    return new FormData(form);
  }

  _onEmojiClick() {
    this.getElement().querySelector(`.film-details__new-comment`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `IMG` && evt.target.getAttribute(`src`) !== this._emojiSrc) {
        this._emojiSrc = evt.target.getAttribute(`src`);
        this._removeEmoji();
        if (this._emojiSrc) {
          this._renderEmoji();
          this.getEmojiContainer().setAttribute(`style`, `box-shadow: 0;`);
        }
      }
    });
  }

  getEmojiContainer() {
    return this.getElement().querySelector(`.film-details__add-emoji-label`);
  }

  _getEmoji() {
    return this.getEmojiContainer().querySelector(`img`);
  }

  _removeEmoji() {
    if (this._getEmoji()) {
      this._getEmoji().remove();
    }
  }

  _renderEmoji() {
    const emojiTemplate = `<img width="55" height="55" alt="emoji">`;
    const emojiImg = createElement(emojiTemplate);
    emojiImg.src = this._emojiSrc;
    this.getEmojiContainer().append(emojiImg);
  }

  rerender(card, comments) {
    this._data = card;
    //
    this._comments = comments;
    this._emojiSrc = null;
    super.rerender();
  }

  setUserRatingClickHandler(handler) {
    this._userRatingClickHandler = handler;
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.addEventListener(`click`, handler);
    });
  }

  setUserRatingResetHandler(handler) {
    this._userRatingResetHandler = handler;
    if (this.getElement().querySelector(`.film-details__watched-reset`)) {
      this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, handler);
    }
  }

  disableUserRating() {
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((it) => {
      it.disabled = true;
    });
  }

  activateUserRating() {
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((it) => {
      it.disabled = false;
    });
  }

  disableForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  activateForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  recoveryListeners() {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._watchlistInputClickHandler);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._watchedInputClickHandler);
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._favoriteInputClickHandler);
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentsButtonClickHandler);
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`submit`, this._commentSubmitHandler);
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`keydown`, this._keyDowHandler);
    if (this.getElement().querySelector(`.film-details__watched-reset`)) {
      this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._userRatingResetHandler);
    }
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.addEventListener(`click`, this._userRatingClickHandler);
    });

    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    this._onEmojiClick();
  }
}
