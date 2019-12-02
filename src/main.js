import {createUserRatingTemplate} from "./components/user-rating";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createFilmsContainerTemplate} from "./components/films-container";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createFilmCardTemplate} from "./components/film-card";
import {createFilmDetailsTemplate} from "./components/film-details";
import {generateFilmCards} from "./mock/film-card";
import {generateRank} from "./mock/rating";
import {getRandomInteger} from "./util";

const FILM_COUNT = 12;
const FILM_EXTRA_COUNT = 2;
const FILM_COUNT_ON_START = 5;
const FILM_COUNT_BY_BUTTON = 5;

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const mainFilmCardsData = generateFilmCards(FILM_COUNT);
const rank = generateRank();

const siteHeaderElement = document.querySelector(`.header`);
renderElement(siteHeaderElement, createUserRatingTemplate(rank));

const siteMainElement = document.querySelector(`.main`);
renderElement(siteMainElement, createSiteMenuTemplate(mainFilmCardsData));
renderElement(siteMainElement, createSortTemplate());
renderElement(siteMainElement, createFilmsContainerTemplate());

const filmsListMainElement = siteMainElement.querySelector(`.films .films-list`);
renderElement(filmsListMainElement, createShowMoreButtonTemplate());

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);
const showMoreButtonElement = siteMainElement.querySelector(`.films-list__show-more`);
let mainFilmCardsShowedCount = FILM_COUNT_ON_START;
const renderFilmCards = (data, container) => {
  if (data.length === 0) {
    showMoreButtonElement.style.display = `none`;
    getFilmsListContainer(container).innerHTML = `<p>There are no movies in our database</p>`;
  } else {
    data.forEach((it) => renderElement(getFilmsListContainer(container), createFilmCardTemplate(it)));
  }
};

const renderRandomFilmCard = (data, filteredData, container) => {
  if (filteredData.length < 2) {
    renderFilmCards(data.slice(0, FILM_EXTRA_COUNT), container);
  } else {
    const randomExtraFilmCards = [filteredData[0], filteredData[getRandomInteger(1, filteredData.length - 1)]];
    renderFilmCards(randomExtraFilmCards, container);
  }
};

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const renderExtraFilmCards = (data) => {
  if (data.length === 0) {
    filmsListExtraElements.forEach((it)=> {
      it.style.display = `none`;
    });
  } else {
    const topRatedFilmCards = data.slice().sort((a, b) => b.film.rating - a.film.rating);
    const mostCommentedFilmCards = data.slice().sort((a, b) => b.comments.length - a.comments.length);
    const highestTopRatedFilmCards = topRatedFilmCards.filter((it) => it.film.rating === topRatedFilmCards[0].film.rating);
    const highestMostCommentedFilmCards = mostCommentedFilmCards.filter((it) => it.comments.length === mostCommentedFilmCards[0].comments.length);
    renderRandomFilmCard(topRatedFilmCards, highestTopRatedFilmCards, filmsListExtraElements[0]);
    renderRandomFilmCard(mostCommentedFilmCards, highestMostCommentedFilmCards, filmsListExtraElements[1]);
  }
};


renderFilmCards(mainFilmCardsData.slice(0, FILM_COUNT_ON_START), filmsListMainElement);
renderExtraFilmCards(mainFilmCardsData);

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

renderElement(document.body, createFilmDetailsTemplate(mainFilmCardsData[0]));
