import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {isEscEvent, renderComponent, DEBOUNCE_INTERVAL} from "../util";
import Comments from '../models/comments.js';
import Movie from "../models/movie";
import {debounce} from "debounce";

const parseFormData = (formData) => {
  return new Comments({
    'comment': formData.get(`comment`),
    'date': new Date().getTime(),
    'emotion': formData.get(`comment-emoji`)
  });
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._onViewChange = onViewChange;
    this.data = {};
    this._commentsModel = new Comments();
    this._currentRatingElement = null;

    this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmCardElementClick = this._onFilmCardElementClick.bind(this);
  }

  render(card) {
    this.data = card;
    this._filmCardComponent = new FilmCardComponent(card);
    renderComponent(this._container, this._filmCardComponent);

    this._filmCardComponent.setWatchlistButtonClickHandler(debounce((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign(new Movie(), this.data, {watchlist: !this.data.watchlist}));
    }, DEBOUNCE_INTERVAL));

    this._filmCardComponent.setWatchedButtonClickHandler(debounce((evt) => {
      evt.preventDefault();
      const updatedData = new Movie();

      Object.assign(updatedData, this.data, {
        watched: !this.data.watched,
        personalRating: 0,
        watchingDate: new Date()
      });

      this._onDataChange(this.data.id, updatedData, true);
    }, DEBOUNCE_INTERVAL));

    this._filmCardComponent.setFavoritesButtonClickHandler(debounce((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign(new Movie(), this.data, {favorite: !this.data.favorite}));
    }, DEBOUNCE_INTERVAL));

    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);
  }

  rerender(card) {
    this.data = card;
    this._filmCardComponent.rerender(card);
    if (this._filmDetailsComponent) {
      if (this.data.comments) {
        this._commentsModel.getComments(this.data.id)
          .then(Comments.parseComments)
          .then((comments) => {
            this._filmDetailsComponent.rerender(card, comments);
          })
          .catch(()=> {
            this._filmDetailsComponent.rerender(card, []);
            this._filmDetailsComponent.hideComments();
          });
      } else {
        this._filmDetailsComponent.rerender(card, []);
      }
    }
  }

  setDefaultView() {
    this._closeFilmDetails();
  }

  destroy() {
    this._filmCardComponent.removeElement();
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

  _onFilmCardElementClick(evt) {
    evt.preventDefault();
    this._onViewChange();
    if (this.data.comments) {
      this._commentsModel.getComments(this.data.id)
        .then(Comments.parseComments)
        .then((comments) => {
          this._filmDetailsComponent = new FilmDetailsComponent(this.data, comments);
          this._filmDetailsComponent.setDeleteCommentsButtonClickHandler((e) => {
            e.preventDefault();
            if (e.target.classList.contains(`film-details__comment-delete`)) {
              this._filmDetailsComponent.setDeleteBtnState(e.target, true);
              this._commentsModel.deleteComment(e.target.dataset.commentId)
                .then(() => this._onDataChange(this.data.id, this.data, true))
                .catch(() => {
                  this._filmDetailsComponent.setDeleteBtnState(e.target, false);
                });
            }
          });

          renderComponent(this._container, this._filmDetailsComponent);
          this._setFilmDetailsHandlers();
        })
        .catch(() => {
          this._filmDetailsComponent = new FilmDetailsComponent(this.data, []);
          this._filmDetailsComponent.hideComments();
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
    this._filmDetailsComponent.setWatchlistInputClickHandler(debounce(() => {
      this._onDataChange(this.data.id, Object.assign(new Movie(), this.data, {watchlist: !this.data.watchlist}));
    }, DEBOUNCE_INTERVAL));

    this._filmDetailsComponent.setWatchedInputClickHandler(debounce(() => {
      const updatedData = new Movie();

      Object.assign(updatedData, this.data, {
        watched: !this.data.watched,
        personalRating: 0,
        watchingDate: new Date()
      });

      if (!updatedData.watched) {
        this._filmDetailsComponent.disableUserRating();
      }

      this._onDataChange(this.data.id, updatedData, true);
    }, DEBOUNCE_INTERVAL));

    this._filmDetailsComponent.setFavoritesInputClickHandler(debounce(() => {
      this._onDataChange(this.data.id, Object.assign(new Movie(), this.data, {favorite: !this.data.favorite}));
    }, DEBOUNCE_INTERVAL));

    this._filmDetailsComponent.setCommentSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._filmDetailsComponent.getFormData();
      const data = parseFormData(formData);
      this._filmDetailsComponent.setErrorStateComment();

      if (!data.emoji) {
        this._filmDetailsComponent.setErrorStateEmoji();
      }

      if (!data.comment) {
        this._filmDetailsComponent.setErrorStateComment(true);
        this._filmDetailsComponent.getCommentInputElement().addEventListener(`input`, () => {
          this._filmDetailsComponent.setErrorStateComment();
        });
      }

      this._filmDetailsComponent.disableForm();
      this._filmDetailsComponent.setErrorState(this._filmDetailsComponent.getCommentInputElement());
      this._commentsModel.createComment(this.data.id, data)
        .then(() => this._onDataChange(this.data.id, this.data, true))
        .catch(() => {
          this._filmDetailsComponent.setErrorState(this._filmDetailsComponent.getCommentInputElement(), true);
          this._filmDetailsComponent.setErrorStateComment(true);
          this._filmDetailsComponent.activateForm();
        });
    });

    this._filmDetailsComponent.setKeyDownHandler((evt) => {
      if (evt.ctrlKey && evt.key === `Enter`) {
        this._filmDetailsComponent.getElement().querySelector(`.film-details__inner`).dispatchEvent(new Event(`submit`));
      }
    });

    this._filmDetailsComponent.setUserRatingResetHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign(new Movie(), this.data, {personalRating: 0}), true);
    });

    this._filmDetailsComponent.setUserRatingClickHandler((evt) => {
      const oldRating = this.data.personalRating;
      const newRating = Object.assign(new Movie(), this.data, {personalRating: parseInt(evt.target.value, 10)});
      this._filmDetailsComponent.setErrorState(this._filmDetailsComponent.getUserRatingElement());
      if (this._currentRatingElement) {
        this._filmDetailsComponent.setElementBackground(this._currentRatingElement, `#d8d8d8`);
      }

      if (parseInt(evt.target.value, 10) === this.data.personalRating) {
        this._filmDetailsComponent.setElementBackground(evt.target.labels[0], `#ffe800`);
      }

      this._currentRatingElement = evt.target.labels[0];

      if (newRating.personalRating !== oldRating) {
        this._filmDetailsComponent.disableUserRating();
        this._onDataChange(this.data.id, newRating, true, oldRating);
      }
    });

    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
    document.addEventListener(`keydown`, this._onFilmDetailsEscPress);
  }

  onRatingUpdateError() {
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.setErrorState(this._filmDetailsComponent.getUserRatingElement(), true);
      this._filmDetailsComponent.setElementBackground(this._currentRatingElement, `red`);
      this._filmDetailsComponent.activateUserRating();
    }
  }
}
