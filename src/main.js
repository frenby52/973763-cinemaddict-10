import {generateFilmCards} from "./mock/film-card";
import {generateRank} from "./mock/rating";
import {getSortedData, getHighestValuesData, getRandomArrayItems, renderElement, isEscEvent} from "./util";
import FilmCardComponent from "./components/film-card";
import FilmDetailsComponent from "./components/film-details";
import FilmsContainerComponent from "./components/films-container";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sort";
import UserRatingComponent from "./components/user-rating";

const FILM_COUNT = 11;
const FILM_EXTRA_COUNT = 2;
const FILM_COUNT_ON_START = 5;
const FILM_COUNT_BY_BUTTON = 5;

const mainFilmCardsData = generateFilmCards(FILM_COUNT);
const rank = generateRank();

const siteHeaderElement = document.querySelector(`.header`);
renderElement(siteHeaderElement, new UserRatingComponent(rank).getElement());

const siteMainElement = document.querySelector(`.main`);
renderElement(siteMainElement, new SiteMenuComponent(mainFilmCardsData).getElement());
renderElement(siteMainElement, new SortComponent().getElement());
const filmsContainerComponent = new FilmsContainerComponent();
renderElement(siteMainElement, filmsContainerComponent.getElement());

const filmsListMainElement = filmsContainerComponent.getElement().querySelector(`.films .films-list`);
let mainFilmCardsShowedCount = FILM_COUNT_ON_START;

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);

const renderFilmCards = (data, container) => data.forEach((it) => {
  const filmCardComponent = new FilmCardComponent(it);
  const filmDetailsComponent = new FilmDetailsComponent(it);
  renderElement(getFilmsListContainer(container), filmCardComponent.getElement());

  const onFilmCardElementClick = (evt) => {
    evt.preventDefault();
    renderElement(document.body, filmDetailsComponent.getElement());
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

const onShowMoreButtonClick = () => {
  const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
  mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
  renderFilmCards(mainFilmCardsData.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), filmsListMainElement);

  if (mainFilmCardsShowedCount >= mainFilmCardsData.length) {
    filmsContainerComponent.removeShowMoreBtn();
  }
};

const renderMainFilmCards = (data) => {
  if (data.length === 0) {
    filmsContainerComponent.removeShowMoreBtn();
    filmsContainerComponent.showNoMoviesMessage();
  } else {
    if (mainFilmCardsData.length <= FILM_COUNT_ON_START) {
      filmsContainerComponent.removeShowMoreBtn();
    }
    renderFilmCards(data.slice(0, FILM_COUNT_ON_START), filmsListMainElement);
    filmsContainerComponent.addShowMoreBtnClickHandler(onShowMoreButtonClick);
  }
};

const getExtraFilmCardsData = (data, key) => {
  const sortedData = getSortedData(data, key);
  const highestValuesData = getHighestValuesData(sortedData, key);
  if (highestValuesData.length <= FILM_EXTRA_COUNT) {
    return sortedData.slice(0, FILM_EXTRA_COUNT);
  }
  return getRandomArrayItems(highestValuesData, FILM_EXTRA_COUNT);
};

const filmsListExtraElements = filmsContainerComponent.getElement().querySelectorAll(`.films-list--extra`);
const topRatedFilmElement = filmsListExtraElements[0];
const mostCommentedFilmElement = filmsListExtraElements[1];

const renderExtraFilmCards = (data, key, container) => {
  const filteredData = getExtraFilmCardsData(data, key);
  if ((data.length && Array.isArray(data[0][key]) && !data.some((it) => it[key].length)) || !data.some((it) => it[key])) {
    container.innerHTML = ``;
  } else {
    renderFilmCards(filteredData, container);
  }
};

renderMainFilmCards(mainFilmCardsData);
renderExtraFilmCards(mainFilmCardsData, `rating`, topRatedFilmElement);
renderExtraFilmCards(mainFilmCardsData, `comments`, mostCommentedFilmElement);

const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = () => {
  footerStatsElement.innerHTML = `<p>${mainFilmCardsData.length} movies inside</p>`;
};

renderFooterStats();
