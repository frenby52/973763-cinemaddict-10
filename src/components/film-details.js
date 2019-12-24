import AbstractSmartComponent from "./abstract-smart-component";
import {createElement} from "../util";
import moment from "moment";
import he from "he";

const formatReleaseDate = (date) => moment(date).format(`DD MMMM YYYY`);

const formatCommentsDate = (date) => moment(date).format(`YYYY/MM/DD hh:mm`);

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
      <span class="film-details__comment-day">${formatCommentsDate(comment.date)}</span>
      <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
    </p>
  </div> 
  </li>`).join(`\n`);

const createFilmRatingTemplate = (poster, title) => {
  return (`<section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>`);
};

const createFilmDetailsTemplate = (data) => {
  const {title, originalTitle, rating, poster, age, director, writers, actors, date, country, runtime, genre, description, comments, watchlist, watched, favorite} = data;
  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get" tabindex="1">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatReleaseDate(date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">${createGenresMarkup(genre)}</td>
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
    <div class="form-details__middle-container">${watched ? createFilmRatingTemplate(poster, title) : ``}</div>
    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentsMarkup(comments)}
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
      <button type="submit">submit</button>
  </form>

</section>`);
};

const parseFormData = (formData, id) => {
  return {
    // id: getRandomInteger(0, 100),
    id,
    comment: formData.get(`comment`),
    date: new Date().getTime(),
    author: `you`,
    rating: formData.get(`score`),
    emoji: formData.get(`comment-emoji`)
  };
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(data) {
    super();

    this._data = data;
    this._subscribeOnEvents();
    this._emojiSrc = null;
    this._closeBtnClickHandler = null;
    this._watchlistInputClickHandler = null;
    this._watchedInputClickHandler = null;
    this._favoriteInputClickHandler = null;
    this._deleteCommentsButtonClickHandler = null;
    this._commentSubmitHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data);
  }

  setCloseBtnClickHandler(handler) {
    this._closeBtnClickHandler = handler;
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  setWatchlistInputClickHandler(handler) {
    this._watchlistInputClickHandler = handler;
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, handler);
  }

  setWatchedInputClickHandler(handler) {
    this._watchedInputClickHandler = handler;
    this.getElement().querySelector(`#watched`).addEventListener(`click`, handler);
  }

  setFavoritesInputClickHandler(handler) {
    this._favoriteInputClickHandler = handler;
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, handler);
  }

  setDeleteCommentsButtonClickHandler(handler) {
    this._deleteCommentsButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, handler);
  }

  getForm() {
    return this.getElement().querySelector(`.film-details__inner`);
  }

  getFormData() {
    const form = this.getForm();
    let newCommentId = 0;
    const formData = new FormData(form);
    if (this._data.comments.length) {
      const highestIdComment = this._data.comments.slice().sort((a, b) => b.id - a.id).slice(0, 1);
      newCommentId = highestIdComment[0].id + 1;
    }

    return parseFormData(formData, newCommentId);
    // return formData;
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

  setCommentSubmitHandler(handler) {
    this._commentSubmitHandler = handler;
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`submit`, handler);
  }

  _onKeyDownSubmit() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    form.addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && evt.keyCode === 13) {
        evt.preventDefault();

        form.submit();
      }
    });
  }

  rerender(card) {
    this._data = card;
    this._emojiSrc = null;
    super.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._watchlistInputClickHandler);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._watchedInputClickHandler);
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._favoriteInputClickHandler);
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentsButtonClickHandler);
    this.getElement().querySelector(`.film-details__inner`).addEventListener(`submit`, this._commentSubmitHandler);

    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    this._onKeyDownSubmit();
    this._onEmojiClick();
  }
}
