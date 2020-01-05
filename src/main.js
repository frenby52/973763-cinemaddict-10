import {generateFilmCards} from "./mock/film-card";
import {renderComponent} from "./util";
import UserRatingComponent from "./components/user-rating";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import SortController from "./controllers/sort-controller";
import Movies from "./models/movies";
import StatisticsComponent from './components/statistics';

const FILM_COUNT = 11;

const cardsData = generateFilmCards(FILM_COUNT);

const moviesModel = new Movies();
moviesModel.setCards(cardsData);

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

const pageController = new PageController(mainContainer, moviesModel);
pageController.render();

const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = () => {
  footerStatsElement.innerHTML = `<p>${cardsData.length} movies inside</p>`;
};

renderFooterStats();
