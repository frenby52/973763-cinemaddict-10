import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {isEscEvent, renderComponent} from "../util";
import Comments from '../models/comments.js';
import Movie from '../models/movie.js';

const parseFormData = (formData, id) => {
  return new Comments({
    // id: getRandomInteger(0, 100),
    // id,
    'comment': formData.get(`comment`),
    'date': new Date().getTime(),
    // author: `you`,
    // rating: formData.get(`score`),
    // 'emoji': formData.get(`comment-emoji`)
    'emotion': formData.get(`comment-emoji`)
  });
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._onViewChange = onViewChange;
    this.data = {};
    this._api = api;

    this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmCardElementClick = this._onFilmCardElementClick.bind(this);
  }

  render(card) {
    this.data = card;
    this._filmCardComponent = new FilmCardComponent(card);
    renderComponent(this._container, this._filmCardComponent);

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.watchlist = !updatedMovie.watchlist;
      this._onDataChange(this.data.id, updatedMovie);
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.watched = !updatedMovie.watched;
      this._onDataChange(this.data.id, updatedMovie);
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.favorite = !updatedMovie.favorite;
      this._onDataChange(this.data.id, updatedMovie);
    });

    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);
  }

  // rerender(card) {
  //   this.data = card;
  //   this._filmCardComponent.rerender(card);
  //   if (this._filmDetailsComponent) {
  //     this._filmDetailsComponent.rerender(card);
  //   }
  // }

  rerender(card) {
    this.data = card;
    this._filmCardComponent.rerender(card);
    if (this._filmDetailsComponent) {
      if (this.data.comments) {
        this._api.getComments(this.data.id)
          .then((comments) => {
            // console.log(comments)
            this._filmDetailsComponent.rerender(card, comments);
          });
      } else {
        this._filmDetailsComponent.rerender(card, []);
      }
    }
  }

  _closeFilmDetails() {
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.getElement().remove();
      document.removeEventListener(`keydown`, this._onFilmDetailsEscPress);
    }
  }

  _onFilmDetailsEscPress(evt) {
    isEscEvent(evt, this._closeFilmDetails);
  }

  _onFilmCardElementClick(e) {
    e.preventDefault();
    this._onViewChange();
    if (this.data.comments) {
      this._api.getComments(this.data.id)
        .then((comments) => {
          // console.log(comments)
          this._filmDetailsComponent = new FilmDetailsComponent(this.data, comments);
          renderComponent(this._container, this._filmDetailsComponent);
          this._setFilmDetailsHandlers();
        });
    } else {
      this._filmDetailsComponent = new FilmDetailsComponent(this.data, []);
      renderComponent(this._container, this._filmDetailsComponent);
      this._setFilmDetailsHandlers();
    }
  }

  _setFilmDetailsHandlers() {
    this._filmDetailsComponent.setWatchlistInputClickHandler(() => {
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.watchlist = !updatedMovie.watchlist;
      this._onDataChange(this.data.id, updatedMovie);
    });

    this._filmDetailsComponent.setWatchedInputClickHandler(() => {
      // this._onDataChange(this.data.id, Object.assign({}, this.data, {
      //   watched: !this.data.watched,
      // }));
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.watched = !updatedMovie.watched;
      this._onDataChange(this.data.id, updatedMovie);
    });

    this._filmDetailsComponent.setFavoritesInputClickHandler(() => {
      const updatedMovie = new Movie(this.data.toRAW());
      updatedMovie.favorite = !updatedMovie.favorite;
      this._onDataChange(this.data.id, updatedMovie);
    });

    // this._filmDetailsComponent.setDeleteCommentsButtonClickHandler(() => this._onDataChange(card.id, null));
    this._filmDetailsComponent.setDeleteCommentsButtonClickHandler((evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`film-details__comment-delete`)) {
        const newCommentsData = this.data.comments.filter((it) => it.id !== parseInt(evt.target.getAttribute(`data-comment-id`), 10));

        this._onDataChange(this.data.id, Object.assign({}, this.data, {
          comments: newCommentsData,
        }));
      }
    });

    this._filmDetailsComponent.setCommentSubmitHandler((evt) => {
      evt.preventDefault();
      // const data = this._filmDetailsComponent.getFormData();
      const formData = this._filmDetailsComponent.getFormData();
      const data = parseFormData(formData);

      // console.log(...data);
      // console.log(card);
      // console.log(card.comments);
      // console.log(data);
      if (!data.emoji) {
        this._filmDetailsComponent.getEmojiContainer().setAttribute(`style`, `box-shadow: inset 0 0 10px red;`);
      }

      if (!data.comment) {
        const commentInput = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`);
        commentInput.setAttribute(`style`, `outline: 3px solid red;`);
        commentInput.addEventListener(`input`, () => {
          commentInput.setAttribute(`style`, `outline: none;`);
        });
      }

      // const myComment = Object.assign({}, data);
      // this.data.comments.push(myComment);
      // this._onDataChange(this.data.id, this.data);

      this._api.createComment(this.data.id, data)
        .then(() => this._onDataChange(this.data.id, this.data));
    });

    this._filmDetailsComponent.setKeyDownHandler((evt) => {
      if (evt.ctrlKey && evt.keyCode === 13) {
        this._filmDetailsComponent.getElement().querySelector(`.film-details__inner`).dispatchEvent(new Event(`submit`));
      }
    });

    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
    document.addEventListener(`keydown`, this._onFilmDetailsEscPress);
  }

  setDefaultView() {
    this._closeFilmDetails();
  }

  destroy() {
    this._filmCardComponent.removeElement();
  }
}
