import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {isEscEvent, renderComponent} from "../util";

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._onViewChange = onViewChange;
    this.data = {};

    this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmCardElementClick = this._onFilmCardElementClick.bind(this);
    // this._onCtrlEnterPress = this._onCtrlEnterPress.bind(this);
  }

  render(card) {
    this.data = card;
    this._filmCardComponent = new FilmCardComponent(card);
    renderComponent(this._container, this._filmCardComponent);

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        watchlist: !this.data.watchlist,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        watched: !this.data.watched,
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        favorite: !this.data.favorite,
      }));
    });

    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);
  }

  rerender(card) {
    this.data = card;
    this._filmCardComponent.rerender(card);
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.rerender(card);
    }
  }

  _closeFilmDetails() {
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.getElement().remove();
      document.removeEventListener(`keydown`, this._onFilmDetailsEscPress);
      // document.removeEventListener(`keydown`, this._onCtrlEnterPress);
    }
  }

  _onFilmDetailsEscPress(evt) {
    isEscEvent(evt, this._closeFilmDetails);
  }

  _onFilmCardElementClick(e) {
    e.preventDefault();
    this._onViewChange();
    this._filmDetailsComponent = new FilmDetailsComponent(this.data);
    renderComponent(this._container, this._filmDetailsComponent);

    this._filmDetailsComponent.setWatchlistInputClickHandler(() => {
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        watchlist: !this.data.watchlist,
      }));
    });

    this._filmDetailsComponent.setWatchedInputClickHandler(() => {
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        watched: !this.data.watched,
      }));
    });

    this._filmDetailsComponent.setFavoritesInputClickHandler(() => {
      this._onDataChange(this.data.id, Object.assign({}, this.data, {
        favorite: !this.data.favorite,
      }));
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
      const data = this._filmDetailsComponent.getFormData();
      // console.log(...data);
      // console.log(card);
      // console.log(card.comments);
      // console.log(data);
      if (!data.emoji) {
        this._filmDetailsComponent.getEmojiContainer().setAttribute(`style`, `box-shadow: inset 0 0 8px red;`);
        return;
      }
      const myComment = Object.assign({}, data);
      this.data.comments.push(myComment);
      this._onDataChange(this.data.id, this.data);
    });

    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
    document.addEventListener(`keydown`, this._onFilmDetailsEscPress);
    // document.addEventListener(`keydown`, this._onCtrlEnterPress);
  }

  // _onCtrlEnterPress(evt) {
  //   if (evt.ctrlKey && evt.keyCode === 13) {
  //     const form = this._filmDetailsComponent.getForm();
  //     // form.submit();
  //   }
  // }

  setDefaultView() {
    this._closeFilmDetails();
  }

  destroy() {
    this._filmCardComponent.removeElement();
  }
}
