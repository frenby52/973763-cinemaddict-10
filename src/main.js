import {generateFilmCards} from "./mock/film-card";
import {generateRank} from "./mock/rating";
import {renderComponent} from "./util";
import UserRatingComponent from "./components/user-rating";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import Movies from "./models/movies";

const FILM_COUNT = 11;

const cardsData = generateFilmCards(FILM_COUNT);
console.log(cardsData)
const rank = generateRank();

const siteHeaderElement = document.querySelector(`.header`);
renderComponent(siteHeaderElement, new UserRatingComponent(rank));

const mainContainer = document.querySelector(`.main`);

const moviesModel = new Movies();
moviesModel.setCards(cardsData);

const filterController = new FilterController(mainContainer, moviesModel);
filterController.render();

// const pageController = new PageController(mainContainer);
const pageController = new PageController(mainContainer, moviesModel);

// pageController.render(cardsData);
pageController.render();



const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = () => {
  footerStatsElement.innerHTML = `<p>${cardsData.length} movies inside</p>`;
};

renderFooterStats();
