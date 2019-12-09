import {getHighestValuesData, getRandomArrayItems, getSortedData, isEscEvent, renderComponent} from "../util";
import SiteMenuComponent from "../components/site-menu";
import SortComponent from "../components/sort";
import FilmsContainerComponent from "../components/films-container";
import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import MainFilmCardsComponent from "../components/main-film-cards";
import ExtraFilmCardsComponent from "../components/extra-fillm-cards";

const FILM_EXTRA_COUNT = 2;
const FILM_COUNT_ON_START = 5;
const FILM_COUNT_BY_BUTTON = 5;

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);

const getExtraFilmCardsData = (data, key) => {
  const sortedData = getSortedData(data, key);
  const highestValuesData = getHighestValuesData(sortedData, key);
  if (highestValuesData.length <= FILM_EXTRA_COUNT) {
    return sortedData.slice(0, FILM_EXTRA_COUNT);
  }
  return getRandomArrayItems(highestValuesData, FILM_EXTRA_COUNT);
};

export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(data) {
    renderComponent(this._container, new SiteMenuComponent(data));
    renderComponent(this._container, new SortComponent());

    const filmsContainerComponent = new FilmsContainerComponent();
    renderComponent(this._container, filmsContainerComponent);
    const filmsContainerElement = filmsContainerComponent.getElement();

    const mainFilmCardsComponent = new MainFilmCardsComponent();
    renderComponent(filmsContainerElement, mainFilmCardsComponent);
    const mainFilmCardsElement = mainFilmCardsComponent.getElement();

    const topRatedComponent = new ExtraFilmCardsComponent(`Top rated`);
    renderComponent(filmsContainerElement, topRatedComponent);
    const topRatedElement = topRatedComponent.getElement();

    const mostCommentedComponent = new ExtraFilmCardsComponent(`Most commented`);
    renderComponent(filmsContainerElement, mostCommentedComponent);
    const mostCommentedElement = mostCommentedComponent.getElement();

    const renderFilmCards = (dataToRender, cardsContainer) => dataToRender.forEach((it) => {
      const filmCardComponent = new FilmCardComponent(it);
      const filmDetailsComponent = new FilmDetailsComponent(it);
      renderComponent(getFilmsListContainer(cardsContainer), filmCardComponent);

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
    });

    const renderExtraFilmCards = (key, cardsContainer) => {
      const filteredData = getExtraFilmCardsData(data, key);
      if ((data.length && Array.isArray(data[0][key]) && !data.some((it) => it[key].length)) || !data.some((it) => it[key])) {
        cardsContainer.innerHTML = ``;
      } else {
        renderFilmCards(filteredData, cardsContainer);
      }
    };

    let mainFilmCardsShowedCount = FILM_COUNT_ON_START;

    const onShowMoreButtonClick = () => {
      const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
      mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
      renderFilmCards(data.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), mainFilmCardsElement);

      if (mainFilmCardsShowedCount >= data.length) {
        mainFilmCardsComponent.removeShowMoreBtn();
      }
    };

    if (data.length === 0) {
      mainFilmCardsComponent.removeShowMoreBtn();
      mainFilmCardsComponent.showNoMoviesMessage();
      topRatedComponent.removeElement(filmsContainerElement);
      mostCommentedComponent.removeElement(filmsContainerElement);
    } else {
      if (data.length <= FILM_COUNT_ON_START) {
        mainFilmCardsComponent.removeShowMoreBtn();
      }
      renderFilmCards(data.slice(0, FILM_COUNT_ON_START), mainFilmCardsElement);
      mainFilmCardsComponent.addShowMoreBtnClickHandler(onShowMoreButtonClick);
      renderExtraFilmCards(`rating`, topRatedElement);
      renderExtraFilmCards(`comments`, mostCommentedElement);
    }
  }
}
