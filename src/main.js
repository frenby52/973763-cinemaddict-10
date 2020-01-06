// import {generateFilmCards} from "./mock/film-card";
import {renderComponent} from "./util";
import UserRatingComponent from "./components/user-rating";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import SortController from "./controllers/sort-controller";
import Movies from "./models/movies";
import StatisticsComponent from './components/statistics';
import API from "./api";

const AUTHORIZATION = `Basic eo0w590ik29889a52`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

// const FILM_COUNT = 11;

// const cardsData = generateFilmCards(FILM_COUNT);

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new Movies();
// moviesModel.setCards(cardsData);

const siteHeaderElement = document.querySelector(`.header`);
renderComponent(siteHeaderElement, new UserRatingComponent(moviesModel));

const mainContainer = document.querySelector(`.main`);
const filterController = new FilterController(mainContainer, moviesModel);
filterController.setStatsClickHandler((isStatsActive) => {
  if (isStatsActive) {
    sortController.hide();
    statisticsComponent.show();
    pageController.hide();
  } else {
    sortController.show();
    statisticsComponent.hide();
    pageController.show();
  }
});
filterController.render();

const sortController = new SortController(mainContainer, moviesModel);
sortController.render();

const statisticsComponent = new StatisticsComponent(moviesModel);
renderComponent(mainContainer, statisticsComponent);
statisticsComponent.hide();

const pageController = new PageController(mainContainer, moviesModel, api);
pageController.render();

const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = (data) => {
  footerStatsElement.innerHTML = `<p>${data.length} movies inside</p>`;
};

// renderFooterStats();

api.getCards()
  .then((cards) => {
    console.log(cards)
    moviesModel.setCards(cards);
    pageController.render();
    renderFooterStats(cards);
  });
