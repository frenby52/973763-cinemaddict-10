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

const renderFilmCards = (cards, container, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(card);

    return movieController;
  });
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    // this._cards = [];
    this._showedMovieControllers = [];
    this._showingCardsCount = FILM_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._mainFilmCardsComponent = new MainFilmCardsComponent();
    this._topRatedComponent = new ExtraFilmCardsComponent(`Top rated`);
    this._mostCommentedComponent = new ExtraFilmCardsComponent(`Most commented`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onShowMoreButtonClick = this.onShowMoreButtonClick.bind(this);

  }

  // render(cards) {
  render() {
    // this._cards = cards;
    const cards = this._moviesModel.getCards();
    // renderComponent(this._container, new SiteMenuComponent(cards));
    renderComponent(this._container, this._sortComponent);
    renderComponent(this._container, this._filmsContainerComponent);
    // this._renderMainFilmCards(cards);
    this._renderMainFilmCards(cards.slice(0, this._showingCardsCount));


    console.log(this._showingCardsCount)

    // this._renderLoadMoreButton();
    renderComponent(this._filmsContainerComponent.getElement(), this._mainFilmCardsComponent);
    if (cards.length) {
      this._renderTopRatedFilmCards(cards);
      this._renderMostCommentedFilmCards(cards);
      renderComponent(this._filmsContainerComponent.getElement(), this._topRatedComponent);
      renderComponent(this._filmsContainerComponent.getElement(), this._mostCommentedComponent);

      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
      this._moviesModel.setFilterChangeHandler(this._onFilterChange);
      this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);
      // this._mainFilmCardsComponent.recoverShowMoreBtnListener();
    }
  }

  _renderMainFilmCards(cards) {
    const newCards = renderFilmCards(cards, this._mainFilmCardsComponent.getContainer(), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    // this._showingCardsCount = this._showedMovieControllers.length;

  }

  onShowMoreButtonClick() {
    this._mainFilmCardsComponent.removeShowMoreBtn();
    const prevCardsCount = this._showingCardsCount;
    const cards = this._moviesModel.getCards();

    this._showingCardsCount = this._showingCardsCount + FILM_COUNT_BY_BUTTON;
    this._renderMainFilmCards(cards.slice(prevCardsCount, this._showingCardsCount));

    if (this._showingCardsCount < cards.length) {
      this._mainFilmCardsComponent.renderShowMoreBtn();
      // this.recoverListener()
      // this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);
      this._mainFilmCardsComponent.recoverShowMoreBtnListener();
    }
  }

  recoverListener() {
    this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);
  }

  _renderLoadMoreButton() {
    // this._mainFilmCardsComponent.removeShowMoreBtn();

    if (this._showingCardsCount >= this._moviesModel.getCards().length) {
      // return;
      // this._mainFilmCardsComponent.removeShowMoreBtn();
    }

    console.log(`show`)
    // console.log(this._mainFilmCardsComponent.renderShowMoreBtn())
    // this._mainFilmCardsComponent.renderShowMoreBtn()
    // this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);

  }

  // let mainFilmCardsShowedCount = FILM_COUNT_ON_START;
  // this._showingCardsCount = FILM_COUNT_ON_START;
  //
  // const onShowMoreButtonClick = () => {
  //   const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
  //   if (mainFilmCardsShowedCount >= cards.length) {
  //     this._showingCardsCount = cards.length;
  //     this._mainFilmCardsComponent.removeShowMoreBtn();
  //   }
  //   mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
  //   this._showingCardsCount += FILM_COUNT_BY_BUTTON;
  //   const newCards = renderFilmCards(cards.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), this._mainFilmCardsComponent.getContainer(), this._onDataChange, this._onViewChange);
  //   this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
  // };

  // if (!cards.length) {
  //   this._mainFilmCardsComponent.removeShowMoreBtn();
  //   this._mainFilmCardsComponent.showNoMoviesMessage();
  // } else {
  //   if (cards.length <= FILM_COUNT_ON_START) {
  //     this._mainFilmCardsComponent.removeShowMoreBtn();
  //   } else {
  //     this._mainFilmCardsComponent.setShowMoreBtnClickHandler(onShowMoreButtonClick);
  //   }
  //   const newCards = renderFilmCards(cards.slice(0, FILM_COUNT_ON_START), this._mainFilmCardsComponent.getContainer(), this._onDataChange, this._onViewChange);
  //   this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
  //   this._showingCardsCount = this._showedMovieControllers.length;
  // }

  _renderExtraFilmCards(cards, container, key) {
    const filteredData = getExtraFilmCardsData(cards, key);
    const isTotalRatingNull = !cards.some((it) => it[key]);
    const isTotalCommentsNull = cards.length && Array.isArray(cards[0][key]) && !cards.some((it) => it[key].length);
    if (isTotalCommentsNull || isTotalRatingNull) {
      container.innerHTML = ``;
    } else {
      const newCards = renderFilmCards(filteredData, container, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    }
  }

  _renderTopRatedFilmCards(cards) {
    this._renderExtraFilmCards(cards, this._topRatedComponent.getContainer(), `rating`);
  }

  _renderMostCommentedFilmCards(cards) {
    this._renderExtraFilmCards(cards, this._mostCommentedComponent.getContainer(), `comments`);
  }

  _onSortTypeChange() {
    // const sortedData = this._sortComponent.getSortedData(this._cards);
    const sortedData = this._sortComponent.getSortedData(this._moviesModel.getCards());
    this._mainFilmCardsComponent.removeElement();
    renderComponent(this._filmsContainerComponent.getElement(), this._mainFilmCardsComponent, `afterbegin`);
    this._renderMainFilmCards(sortedData);
  }

  _onDataChange(id, newData) {
    // this._moviesModel.updateCard(id, newData);
    const isCardUpdated = this._moviesModel.updateCard(id, newData);
    if (isCardUpdated) {
      const sameMovieControllers = this._showedMovieControllers.filter((it) => it.data.id === id);
      // sameMovieControllers.forEach((it)=> it.rerender(this._cards[index]));
      sameMovieControllers.forEach((it)=> it.rerender(newData));
    }
    // const index = this._cards.findIndex((it) => it.id === id);
    //
    // if (index === -1) {
    //   return;
    // }
    //
    // this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    // const sameMovieControllers = this._showedMovieControllers.filter((it) => it.data.id === id);
    //
    // sameMovieControllers.forEach((it)=> it.rerender(this._cards[index]));
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  /////////////
  _removeCards() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  ///////////

  _onFilterChange() {
    const cards = this._moviesModel.getCards();
    this._removeCards();


    this._showingCardsCount = FILM_COUNT_ON_START;
    // this._renderMainFilmCards(this._moviesModel.getCards().slice(0, this._showingCardsCount));
    this.render();
    this._mainFilmCardsComponent.removeShowMoreBtn();
    if (cards.length > FILM_COUNT_ON_START) {
      this._mainFilmCardsComponent.renderShowMoreBtn();
      // this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);
      this._mainFilmCardsComponent.recoverShowMoreBtnListener();
    }

    // if (cards.length <= FILM_COUNT_ON_START) {
    //   this._mainFilmCardsComponent.removeShowMoreBtn();
    // } else {
    //   this._mainFilmCardsComponent.removeShowMoreBtn();
    //   this._mainFilmCardsComponent.renderShowMoreBtn();
    //   this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this.onShowMoreButtonClick);
    // }


  }
}
