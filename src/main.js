import {createUserRatingTemplate} from "./components/user-rating";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createFilmsContainerTemplate} from "./components/films-container";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createFilmCardTemplate} from "./components/film-card";
import {createFilmDetailsTemplate} from "./components/film-details";
import {generateFilmCards} from "./mock/film-card";
import {generateFilters} from "./mock/filter";
import {generateRank} from "./mock/rating";

const FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;

const renderElement = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const rank = generateRank();
renderElement(siteHeaderElement, createUserRatingTemplate(rank));

const siteMainElement = document.querySelector(`.main`);
const filters = generateFilters();
renderElement(siteMainElement, createSiteMenuTemplate(filters));
renderElement(siteMainElement, createSortTemplate());
renderElement(siteMainElement, createFilmsContainerTemplate());

const filmsListMainElement = siteMainElement.querySelector(`.films .films-list`);
renderElement(filmsListMainElement, createShowMoreButtonTemplate());

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);

const mainFilmCards = generateFilmCards(FILM_COUNT);
const renderFilmCards = (data, container) => data.forEach((it) => renderElement(getFilmsListContainer(container), createFilmCardTemplate(it)));
renderFilmCards(mainFilmCards, filmsListMainElement);

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmCards = mainFilmCards.slice().sort((a, b) => b.rating - a.rating);
const mostCommentedFilmCards = mainFilmCards.slice().sort((a, b) => b.comments - a.comments);
renderFilmCards(topRatedFilmCards.slice(0, FILM_EXTRA_COUNT), filmsListExtraElements[0]);
renderFilmCards(mostCommentedFilmCards.slice(0, FILM_EXTRA_COUNT), filmsListExtraElements[1]);

renderElement(document.body, createFilmDetailsTemplate());

// изначальная
// new Array(FILM_COUNT).fill(``).forEach(() => render(getFilmsListContainer(filmsListMainElement), createFilmCardTemplate(getFilmCard())));

// filmsListExtraElements.forEach((elem) => {
//   renderFilmCards(topRatedFilmCards.slice(0, 2), elem);
// });

// изначальная
// filmsListExtraElements.forEach((elem) => {
//   new Array(FILM_EXTRA_COUNT).fill(``).forEach(() => render(getFilmsListContainer(elem), createFilmCardTemplate(getFilmCard())));
// });


