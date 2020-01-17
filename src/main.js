import {renderComponent} from "./util";
import UserRatingComponent from "./components/user-rating";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import SortController from "./controllers/sort-controller";
import Movies from "./models/movies";
import StatisticsComponent from './components/statistics';
import API from "./api";
import Movie from "./models/movie";

const api = new API();

const moviesModel = new Movies();

const siteHeaderElement = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const filterController = new FilterController(mainContainer, moviesModel);
const sortController = new SortController(mainContainer, moviesModel);
const pageController = new PageController(mainContainer, moviesModel);
mainContainer.innerHTML = `<h2>Loading…</h2>`;

const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = (data) => {
  footerStatsElement.innerHTML = `<p>${data.length} movies inside</p>`;
};

api.getCards()
  .then(Movie.parseMovies)
  .then((cards) => {
    mainContainer.innerHTML = ``;
    moviesModel.setCards(cards);
    renderComponent(siteHeaderElement, new UserRatingComponent(moviesModel));
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
    sortController.render();

    const statisticsComponent = new StatisticsComponent(moviesModel);
    renderComponent(mainContainer, statisticsComponent);

    statisticsComponent.hide();
    pageController.render();
    renderFooterStats(cards);
  });
