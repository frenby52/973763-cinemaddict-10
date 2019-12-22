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
  }

  render(card) {
    this.data = card;
    this._filmCardComponent = new FilmCardComponent(card);
    renderComponent(this._container, this._filmCardComponent);

    this._setFilmCardComponentClickHandlers(card);
  }

  rerender(card) {
    this.data = card;
    this._filmCardComponent.rerender(this._filmCardComponent, card);
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.rerender(this._filmDetailsComponent, card);
      this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
      this._setFilmDetailsComponentClickHandlers(card);
    }

    this._setFilmCardComponentClickHandlers(card);
  }

  _setFilmCardComponentClickHandlers(card) {
    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      // this._onDataChange(card, Object.assign({}, card, {
      this._onDataChange(card.id, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card.id, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card.id, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });
  }

  _setFilmDetailsComponentClickHandlers(card) {
    console.log(card)
    this._filmDetailsComponent.setWatchlistInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card.id, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmDetailsComponent.setWatchedInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card.id, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmDetailsComponent.setFavoritesInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card.id, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });

    // this._filmDetailsComponent.setDeleteCommentsButtonClickHandler(() => this._onDataChange(card.id, null));
    this._filmDetailsComponent.setDeleteCommentsButtonClickHandler((evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`film-details__comment-delete`)) {
        console.log(evt.target.getAttribute(`data-comment-id`))
        card.comments.forEach((it) => console.log(it.id));
        const newCommentsData = card.comments.filter((it) => it.id !== parseInt(evt.target.getAttribute(`data-comment-id`), 10));
        console.log(newCommentsData)

        this._onDataChange(card.id, Object.assign({}, card, {
          comments: newCommentsData,
        }));
      }
    });
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
    this._filmDetailsComponent = new FilmDetailsComponent(this.data);
    renderComponent(this._container, this._filmDetailsComponent);
    this._setFilmDetailsComponentClickHandlers(this.data);

    document.addEventListener(`keydown`, this._onFilmDetailsEscPress);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
  }

  setDefaultView() {
    this._closeFilmDetails();
  }

  destroy() {
    this._filmCardComponent.removeElement();
  }
}
