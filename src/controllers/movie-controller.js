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

    this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmCardElementClick = this._onFilmCardElementClick.bind(this);
  }

  render(card) {
    this._filmCardComponent = new FilmCardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card);
    renderComponent(this._container, this._filmCardComponent);

    this._setComponentsClickHandlers(card);
  }

  rerender(card) {
    // this._filmCardComponent = new FilmCardComponent(card);
    // this._filmDetailsComponent = new FilmDetailsComponent(card);
    this._filmCardComponent.rerender(this._filmCardComponent, card);
    this._filmDetailsComponent.rerender(this._filmDetailsComponent, card);

    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
    this._setComponentsClickHandlers(card);
  }

  _setComponentsClickHandlers(card) {
    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });

    this._filmDetailsComponent.setWatchlistInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmDetailsComponent.setWatchedInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmDetailsComponent.setFavoritesInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(card, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onFilmDetailsEscPress);
  }

  _onFilmDetailsEscPress(evt) {
    isEscEvent(evt, this._closeFilmDetails);
  }

  _onFilmCardElementClick(evt) {
    evt.preventDefault();
    // renderComponent(document.body, filmDetailsComponent);
    this._onViewChange();
    renderComponent(this._container, this._filmDetailsComponent);
    document.addEventListener(`keydown`, this._onFilmDetailsEscPress);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
  }

  setDefaultView() {
    this._closeFilmDetails();
  }
}
