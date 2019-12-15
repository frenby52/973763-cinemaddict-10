import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {isEscEvent, renderComponent, replaceComponent} from "../util";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onFilmDetailsEscPress = this._onFilmDetailsEscPress.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmCardElementClick = this._onFilmCardElementClick.bind(this);
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card);

    if (oldFilmDetailsComponent && oldFilmCardComponent) {
      replaceComponent(this._filmCardComponent, oldFilmCardComponent);
      replaceComponent(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
    } else {
      renderComponent(this._container, this._filmCardComponent);
    }

    this._filmCardComponent.setElementsClickHandlers(this._onFilmCardElementClick);

    this._filmCardComponent.setWatchlistButtonActiveClass();
    this._filmCardComponent.setWatchedButtonActiveClass();
    this._filmCardComponent.setFavoritesButtonActiveClass();

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });

    this._filmDetailsComponent.setWatchlistInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._filmDetailsComponent.setWatchedInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        watched: !card.watched,
      }));
    });

    this._filmDetailsComponent.setFavoritesInputClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        favorite: !card.favorite,
      }));
    });
  }

  _closeFilmDetails() {
    // this._filmDetailsComponent.removeElement();
    this._filmDetailsComponent.getElement().remove();
    this._filmDetailsComponent.removeEscPressHandler(this._onFilmDetailsEscPress);
  }

  _onFilmDetailsEscPress(evt) {
    isEscEvent(evt, this._closeFilmDetails);
  }

  _onFilmCardElementClick(evt) {
    evt.preventDefault();
    // renderComponent(document.body, filmDetailsComponent);
    renderComponent(this._container, this._filmDetailsComponent);
    this._filmDetailsComponent.setEscPressHandler(this._onFilmDetailsEscPress);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._closeFilmDetails);
  }
}
