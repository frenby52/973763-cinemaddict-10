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

const renderFilmCards = (cards, container, onDataChange) => cards.forEach((card) => {
  const movieController = new MovieController(container, onDataChange);
  // renderFilmCard(card, container);
  movieController.render(card);
});

const renderExtraFilmCards = (cards, key, cardsContainer) => {
  const filteredData = getExtraFilmCardsData(cards, key);
  const isTotalRatingNull = !cards.some((it) => it[key]);
  const isTotalCommentsNull = cards.length && Array.isArray(cards[0][key]) && !cards.some((it) => it[key].length);
  if (isTotalCommentsNull || isTotalRatingNull) {
    cardsContainer.innerHTML = ``;
  } else {
    renderFilmCards(filteredData, cardsContainer);
  }
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._cards = [];

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._mainFilmCardsComponent = new MainFilmCardsComponent();
    this._topRatedComponent = new ExtraFilmCardsComponent(`Top rated`);
    this._mostCommentedComponent = new ExtraFilmCardsComponent(`Most commented`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  render(cards) {
    this._cards = cards;
    renderComponent(this._container, new SiteMenuComponent(this._cards));
    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._filmsContainerComponent);
    this._renderMainFilmCards(this._cards);
    this._renderTopRatedFilmCards(this._cards);
    this._renderMostCommentedFilmCards(this._cards);

    renderComponent(this._filmsContainerComponent.getElement(), this._mainFilmCardsComponent);
    renderComponent(this._filmsContainerComponent.getElement(), this._topRatedComponent);
    renderComponent(this._filmsContainerComponent.getElement(), this._mostCommentedComponent);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderMainFilmCards(cards) {
    let mainFilmCardsShowedCount = FILM_COUNT_ON_START;

    const onShowMoreButtonClick = () => {
      const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
      mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
      renderFilmCards(cards.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), this._mainFilmCardsComponent.getContainer(), this._onDataChange);

      if (mainFilmCardsShowedCount >= cards.length) {
        this._mainFilmCardsComponent.removeShowMoreBtn();
      }
    };

    if (cards.length === 0) {
      this._mainFilmCardsComponent.removeShowMoreBtn();
      this._mainFilmCardsComponent.showNoMoviesMessage();
      this._topRatedComponent.removeElement();
      this._mostCommentedComponent.removeElement();
    } else {
      if (cards.length <= FILM_COUNT_ON_START) {
        this._mainFilmCardsComponent.removeShowMoreBtn();
      }
      renderFilmCards(cards.slice(0, FILM_COUNT_ON_START), this._mainFilmCardsComponent.getContainer(), this._onDataChange);
      this._mainFilmCardsComponent.setShowMoreBtnClickHandler(onShowMoreButtonClick);
    }
  }

  _renderTopRatedFilmCards(cards) {
    renderExtraFilmCards(cards, `rating`, this._topRatedComponent.getContainer());
  }

  _renderMostCommentedFilmCards(cards) {
    renderExtraFilmCards(cards, `comments`, this._mostCommentedComponent.getContainer());
  }

  _onSortTypeChange() {
    const sortedData = this._sortComponent.getSortedData(this._cards);
    this._mainFilmCardsComponent.removeElement();
    renderComponent(this._filmsContainerComponent.getElement(), this._mainFilmCardsComponent, `afterbegin`);
    this._renderMainFilmCards(sortedData);
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    movieController.render(this._cards[index]);
  }
}
