import {generateFilmCards} from "./mock/film-card";
import {generateRank} from "./mock/rating";
import {getSortedData, getHighestValuesData, getRandomArrayItems, renderElement} from "./util";
import CardComponent from "./components/film-card";
import FilmDetailsComponent from "./components/film-details";
import FilmsContainerComponent from "./components/films-container";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sort";
import UserRatingComponent from "./components/user-rating";
import ShowMoreButtonComponent from "./components/show-more-button";

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
renderElement(siteMainElement, new FilmsContainerComponent().getElement());

const filmsListMainElement = siteMainElement.querySelector(`.films .films-list`);
renderElement(filmsListMainElement, new ShowMoreButtonComponent().getElement());

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);
const showMoreButtonElement = siteMainElement.querySelector(`.films-list__show-more`);
let mainFilmCardsShowedCount = FILM_COUNT_ON_START;

// const renderFilmCards = (data, container) => data.forEach((it) => renderElement2(getFilmsListContainer(container), createFilmCardTemplate(it)));
const renderFilmCards = (data, container) => data.forEach((it) => renderElement(getFilmsListContainer(container), new CardComponent(it).getElement()));

const renderMainFilmCards = (data) => {
  if (data.length === 0) {
    showMoreButtonElement.classList.add(`visually-hidden`);
    filmsListMainElement.innerHTML = `<p>There are no movies in our database</p>`;
  } else {
    if (mainFilmCardsData.length <= FILM_COUNT_ON_START) {
      showMoreButtonElement.classList.add(`visually-hidden`);
    }
    renderFilmCards(data.slice(0, FILM_COUNT_ON_START), filmsListMainElement);
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

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
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

const onShowMoreButtonClick = () => {
  const mainFilmCardsPreviouslyShowedCount = mainFilmCardsShowedCount;
  mainFilmCardsShowedCount += FILM_COUNT_BY_BUTTON;
  renderFilmCards(mainFilmCardsData.slice(mainFilmCardsPreviouslyShowedCount, mainFilmCardsShowedCount), filmsListMainElement);

  if (mainFilmCardsShowedCount >= mainFilmCardsData.length) {
    showMoreButtonElement.remove();
  }
};
showMoreButtonElement.addEventListener(`click`, onShowMoreButtonClick);

renderElement(document.body, new FilmDetailsComponent(mainFilmCardsData[0]).getElement());
