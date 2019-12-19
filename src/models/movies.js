export default class Movies {
  constructor() {
    this._cards = [];

    this._showedMovieControllers = [];
  }

  getCards() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = cards;
  }

  setShowedMoviesControllers(showedMovieControllers) {
    this._showedMovieControllers = showedMovieControllers;
  }

  updateCard(id, newData) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    const sameMovieControllers = this._showedMovieControllers.filter((it) => it.data.id === id);

    sameMovieControllers.forEach((it)=> it.rerender(this._cards[index]));
  }

}
