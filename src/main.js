import {createUserRatingTemplate} from "./components/user-rating";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createFilmsContainerTemplate} from "./components/films-container";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createFilmCardTemplate} from "./components/film-card";
import {createFilmDetailsTemplate} from "./components/film-details";

const FILM_COUNT = 5;
const FILM_EXTRA_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createUserRatingTemplate());

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createSiteMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsContainerTemplate());

const filmsListMainElement = siteMainElement.querySelector(`.films .films-list`);
render(filmsListMainElement, createShowMoreButtonTemplate());

const getFilmsListContainer = (elem) => elem.querySelector(`.films-list__container`);

new Array(FILM_COUNT).fill(``).forEach(() => render(getFilmsListContainer(filmsListMainElement), createFilmCardTemplate()));

const filmsListExtraElements = siteMainElement.querySelectorAll(`.films-list--extra`);
filmsListExtraElements.forEach((elem) => {
  new Array(FILM_EXTRA_COUNT).fill(``).forEach(() => render(getFilmsListContainer(elem), createFilmCardTemplate()));
});

render(document.body, createFilmDetailsTemplate());
