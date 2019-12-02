export const createSiteMenuTemplate = (data) => {
  const watchlistFilmCards = data.filter((it) => it.film.watchlist);
  const historyFilmCards = data.filter((it) => it.film.history);
  const favoritesFilmCards = data.filter((it) => it.film.favorites);
  return (`<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistFilmCards.length}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilmCards.length}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesFilmCards.length}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`);
};
