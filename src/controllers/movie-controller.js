import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {getFilmsListContainer, isEscEvent, renderComponent, removeComponent} from "../util";

export default class MovieController {
  constructor(container) {
    this._container = container;
  }

  render(card) {
    const filmCardComponent = new FilmCardComponent(card);
    const filmDetailsComponent = new FilmDetailsComponent(card);
    renderComponent(getFilmsListContainer(this._container), filmCardComponent);

    const onFilmCardElementClick = (evt) => {
      evt.preventDefault();
      renderComponent(document.body, filmDetailsComponent);
      filmDetailsComponent.setEscPressHandler(onFilmDetailsEscPress);
      filmDetailsComponent.setCloseBtnClickHandler(onFilmDetailsCloseBtnClick);
    };

    const onFilmDetailsCloseBtnClick = () => closeFilmDetails();

    const onFilmDetailsEscPress = (evt) => isEscEvent(evt, closeFilmDetails);

    const closeFilmDetails = () => {
      removeComponent(filmDetailsComponent);
      filmDetailsComponent.removeEscPressHandler(onFilmDetailsEscPress);
    };

    filmCardComponent.setElementsClickHandlers(onFilmCardElementClick);
  }
}
