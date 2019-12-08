import {generateFilmCards} from "./mock/film-card";
import {generateRank} from "./mock/rating";
import {renderComponent} from "./util";
import UserRatingComponent from "./components/user-rating";
import PageController from "./controllers/page-controller";

const FILM_COUNT = 11;

const cardsData = generateFilmCards(FILM_COUNT);
const rank = generateRank();

const siteHeaderElement = document.querySelector(`.header`);
renderComponent(siteHeaderElement, new UserRatingComponent(rank));

const mainContainer = document.querySelector(`.main`);
const pageController = new PageController(mainContainer);

pageController.render(cardsData);

const footerStatsElement = document.querySelector(`.footer__statistics`);
const renderFooterStats = () => {
  footerStatsElement.innerHTML = `<p>${cardsData.length} movies inside</p>`;
};

renderFooterStats();
