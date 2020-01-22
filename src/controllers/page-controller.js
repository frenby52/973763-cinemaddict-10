import {getHighestValuesData, getRandomArrayItems, getSortedData, renderComponent} from "../util";
import FilmsContainerComponent from "../components/films-container";
import MainFilmCardsComponent from "../components/main-film-cards";
import ExtraFilmCardsComponent from "../components/extra-fillm-cards";
import MovieController from "./movie-controller";
import Movie from "../models/movie";

const FilmsCount = {
  FILM_EXTRA_COUNT: 2,
  FILM_COUNT_ON_START: 5,
  FILM_COUNT_BY_BUTTON: 5
};

const getExtraFilmCardsData = (cards, key) => {
  const sortedData = getSortedData(cards, key);
  const highestValuesData = getHighestValuesData(sortedData, key);
  if (highestValuesData.length <= FilmsCount.FILM_EXTRA_COUNT) {
    return sortedData.slice(0, FilmsCount.FILM_EXTRA_COUNT);
  }
  return getRandomArrayItems(highestValuesData, FilmsCount.FILM_EXTRA_COUNT);
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
    this._showedMovieControllers = [];
    this._showingCardsCount = FilmsCount.FILM_COUNT_ON_START;

    this._filmsContainerComponent = new FilmsContainerComponent();
    this._mainFilmCardsComponent = new MainFilmCardsComponent();
    this._topRatedComponent = new ExtraFilmCardsComponent(`Top rated`);
    this._mostCommentedComponent = new ExtraFilmCardsComponent(`Most commented`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortOrFilterChange = this._onSortOrFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
  }

  render() {
    const cards = this._moviesModel.getCards();
    renderComponent(this._container, this._filmsContainerComponent);
    this._renderMainFilmCards(cards.slice(0, this._showingCardsCount));
    renderComponent(this._filmsContainerComponent.getElement(), this._mainFilmCardsComponent);

    if (!cards.length) {
      this._mainFilmCardsComponent.removeShowMoreBtn();
      this._mainFilmCardsComponent.showNoMoviesMessage();
      this._topRatedComponent.removeElement();
      this._mostCommentedComponent.removeElement();
    } else {
      this._mainFilmCardsComponent.restoreDefaultTitle();
      if (cards.length <= FilmsCount.FILM_COUNT_ON_START) {
        this._mainFilmCardsComponent.removeShowMoreBtn();
      }
      this._renderTopRatedFilmCards(cards);
      this._renderMostCommentedFilmCards(cards);
      renderComponent(this._filmsContainerComponent.getElement(), this._topRatedComponent);
      renderComponent(this._filmsContainerComponent.getElement(), this._mostCommentedComponent);

      this._moviesModel.setSortAndFilterChangeHandler(this._onSortOrFilterChange);
      this._mainFilmCardsComponent.setShowMoreBtnClickHandler(this._onShowMoreButtonClick);
    }
  }

  hide() {
    this._mainFilmCardsComponent.hide();
    this._topRatedComponent.hide();
    this._mostCommentedComponent.hide();
  }

  show() {
    this._mainFilmCardsComponent.show();
    this._topRatedComponent.show();
    this._mostCommentedComponent.show();
  }

  _renderMainFilmCards(cards) {
    const newCards = renderFilmCards(cards, this._mainFilmCardsComponent.getContainer(), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
  }

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

  _removeCards() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _onDataChange(id, newData, isExtraSectionProperty = false, oldRating = null) {
    const sameMovieControllers = this._showedMovieControllers.filter((it) => it.data.id === id);
    this._moviesModel.updateCardByApi(id, newData)
      .then(Movie.parseMovie)
      .then((updatedMovie) => {
        const isCardUpdated = this._moviesModel.updateCard(id, updatedMovie);

        if (isCardUpdated) {
          sameMovieControllers.forEach((it)=> it.rerender(updatedMovie));
          if (isExtraSectionProperty) {
            this._topRatedComponent.removeElement();
            this._mostCommentedComponent.removeElement();
            const cards = this._moviesModel.getCards();
            this._renderTopRatedFilmCards(cards);
            this._renderMostCommentedFilmCards(cards);
            renderComponent(this._filmsContainerComponent.getElement(), this._topRatedComponent);
            renderComponent(this._filmsContainerComponent.getElement(), this._mostCommentedComponent);
          }
        }
      }).catch(() => {
        if (oldRating) {
          sameMovieControllers.forEach((it)=> it.onRatingUpdateError());
        }
      });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onSortOrFilterChange() {
    const cards = this._moviesModel.getCards();
    this._showingCardsCount = FilmsCount.FILM_COUNT_ON_START;

    this._removeCards();
    this.render();
    this._mainFilmCardsComponent.removeShowMoreBtn();

    if (cards.length > FilmsCount.FILM_COUNT_ON_START) {
      this._mainFilmCardsComponent.renderShowMoreBtn();
    }
  }

  _onShowMoreButtonClick() {
    this._mainFilmCardsComponent.removeShowMoreBtn();
    const prevCardsCount = this._showingCardsCount;
    const cards = this._moviesModel.getCards();

    this._showingCardsCount = this._showingCardsCount + FilmsCount.FILM_COUNT_BY_BUTTON;
    this._renderMainFilmCards(cards.slice(prevCardsCount, this._showingCardsCount));

    if (this._showingCardsCount < cards.length) {
      this._mainFilmCardsComponent.renderShowMoreBtn();
    }
  }
}
