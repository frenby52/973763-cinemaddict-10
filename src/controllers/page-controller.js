import {getHighestValuesData, getRandomArrayItems, getSortedData, renderComponent} from "../util";
import SiteMenuComponent from "../components/site-menu";
import SortComponent from "../components/sort";
import FilmsContainerComponent from "../components/films-container";
import MainFilmCardsComponent from "../components/main-film-cards";
import ExtraFilmCardsComponent from "../components/extra-fillm-cards";
import MovieController from "./movie-controller";

const FILM_EXTRA_COUNT = 2;
const FILM_COUNT_ON_START = 5;
const FILM_COUNT_BY_BUTTON = 5;

const getExtraFilmCardsData = (data, key) => {
  const sortedData = getSortedData(data, key);
  const highestValuesData = getHighestValuesData(sortedData, key);
  if (highestValuesData.length <= FILM_EXTRA_COUNT) {
    return sortedData.slice(0, FILM_EXTRA_COUNT);
  }
  return getRandomArrayItems(highestValuesData, FILM_EXTRA_COUNT);
};

const renderFilmCards = (cards, container) => cards.forEach((card) => {
  const movieController = new MovieController(container);
  // renderFilmCard(card, container);
  movieController.render(card);
});

const renderExtraFilmCards = (data, key, cardsContainer) => {
  const filteredData = getExtraFilmCardsData(data, key);
  const isTotalRatingNull = !data.some((it) => it[key]);
  const isTotalCommentsNull = data.length && Array.isArray(data[0][key]) && !data.some((it) => it[key].length);
  if (isTotalCommentsNull || isTotalRatingNull) {
    cardsContainer.innerHTML = ``;
  } else {
    renderFilmCards(filteredData, cardsContainer);
  }
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._mainFilmCardsComponent = new MainFilmCardsComponent();
    this._topRatedComponent = new ExtraFilmCardsComponent(`Top rated`);
    this._mostCommentedComponent = new ExtraFilmCardsComponent(`Most commented`);
  }

  render(data) {
    renderComponent(this._container, new SiteMenuComponent(data));
    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._filmsContainerComponent);
    this._renderMainFilmCards(data);
    this._renderTopRatedFilmCards(data);
    this._renderMostCommentedFilmCards(data);

    const filmsContainerElement = this._filmsContainerComponent.getElement();
    renderComponent(filmsContainerElement, this._mainFilmCardsComponent);
    renderComponent(filmsContainerElement, this._topRatedComponent);
    renderComponent(filmsContainerElement, this._mostCommentedComponent);

    this._sortComponent.setSortTypeChangeHandler(() => {
      const sortedData = this._sortComponent.getSortedData(data);
      this._mainFilmCardsComponent.removeElement();
      renderComponent(filmsContainerElement, this._mainFilmCardsComponent, `afterbegin`);
      this._renderMainFilmCards(sortedData);
    });
  }

  _renderMainFilmCards(data) {
    let mainFilmCardsShowedCount = FILM_COUNT_ON_START;

    const onShowMoreButtonClick = () => {
      const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
      mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
      renderFilmCards(data.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), this._mainFilmCardsComponent.getContainer());

      if (mainFilmCardsShowedCount >= data.length) {
        this._mainFilmCardsComponent.removeShowMoreBtn();
      }
    };

    if (data.length === 0) {
      this._mainFilmCardsComponent.removeShowMoreBtn();
      this._mainFilmCardsComponent.showNoMoviesMessage();
      this._topRatedComponent.removeElement();
      this._mostCommentedComponent.removeElement();
    } else {
      if (data.length <= FILM_COUNT_ON_START) {
        this._mainFilmCardsComponent.removeShowMoreBtn();
      }
      renderFilmCards(data.slice(0, FILM_COUNT_ON_START), this._mainFilmCardsComponent.getContainer());
      this._mainFilmCardsComponent.setShowMoreBtnClickHandler(onShowMoreButtonClick);
    }
  }

  _renderTopRatedFilmCards(data) {
    renderExtraFilmCards(data, `rating`, this._topRatedComponent.getContainer());
  }

  _renderMostCommentedFilmCards(data) {
    renderExtraFilmCards(data, `comments`, this._mostCommentedComponent.getContainer());
  }
}
