import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {getFilmsListContainer, isEscEvent, renderComponent} from "../util";

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
      filmDetailsComponent.addEscPressHandler(onFilmDetailsEscPress);
      filmDetailsComponent.addCloseBtnClickHandler(onFilmDetailsCloseBtnClick);
    };

    const onFilmDetailsCloseBtnClick = () => closeFilmDetails();

    const onFilmDetailsEscPress = (evt) => isEscEvent(evt, closeFilmDetails);

    const closeFilmDetails = () => {
      filmDetailsComponent.removeElement(document.body);
      filmDetailsComponent.removeEscPressHandler(onFilmDetailsEscPress);
    };

    filmCardComponent.addElementsClickHandlers(onFilmCardElementClick);
  }


}
