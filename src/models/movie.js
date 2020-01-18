export default class Movie {
  constructor(card) {

    if (card) {
      this.id = card[`id`] || ``;
      this.title = card[`film_info`][`title`] || ``;
      this.originalTitle = card[`film_info`][`alternative_title`] || ``;
      this.rating = parseInt(card[`film_info`][`total_rating`], 10) || 0;
      this.poster = card[`film_info`][`poster`] || ``;
      this.age = parseInt(card[`film_info`][`age_rating`], 10) || 0;
      this.director = card[`film_info`][`director`] || ``;
      this.writers = new Set(card[`film_info`][`writers`] || []);
      this.actors = new Set(card[`film_info`][`actors`] || []);
      this.date = new Date(card[`film_info`][`release`][`date`]) || null;
      this.country = card[`film_info`][`release`][`release_country`] || ``;
      this.runtime = parseInt(card[`film_info`][`runtime`], 10) || 0;
      this.genre = new Set(card[`film_info`][`genre`] || []);
      this.description = card[`film_info`][`description`] || ``;
      this.personalRating = parseInt(card[`user_details`][`personal_rating`], 10) || 0;
      this.watchlist = Boolean(card[`user_details`][`watchlist`]);
      this.watched = Boolean(card[`user_details`][`already_watched`]);
      this.watchingDate = new Date(card[`user_details`][`watching_date`]) || null;
      this.favorite = Boolean(card[`user_details`][`favorite`]);
      this.comments = card[`comments`] || [];
    }
  }

  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.age,
        'director': this.director,
        'writers': Array.from(this.writers),
        'actors': Array.from(this.actors),
        'release': {
          'date': this.date ? this.date.toISOString() : null,
          'release_country': this.country,
        },
        'runtime': this.runtime,
        'genre': Array.from(this.genre),
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.watchlist,
        'already_watched': this.watched,
        'watching_date': this.watchingDate ? this.watchingDate.toISOString() : null,
        'favorite': this.favorite,
      },
      'comments': this.comments
    };
  }

  static parseMovie(card) {
    return new Movie(card);
  }

  static parseMovies(card) {
    return card.map(Movie.parseMovie);
  }
}
