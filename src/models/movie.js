export default class Movie {
  constructor(data) {

    this.id = data[`id`] || ``;
    this.title = data[`film_info`][`title`] || ``;
    this.originalTitle = data[`film_info`][`alternative_title`] || ``;
    this.rating = parseInt(data[`film_info`][`total_rating`], 10) || 0;
    this.poster = data[`film_info`][`poster`] || ``;
    this.age = parseInt(data[`film_info`][`age_rating`], 10) || 0;
    this.director = data[`film_info`][`director`] || ``;
    this.writers = new Set(data[`film_info`][`writers`] || []);
    this.actors = new Set(data[`film_info`][`actors`] || []);
    this.date = new Date(data[`film_info`][`release`][`date`]) || null;
    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.runtime = parseInt(data[`film_info`][`runtime`], 10) || 0;
    this.genre = new Set(data[`film_info`][`genre`] || []);
    this.description = data[`film_info`][`description`] || ``;
    this.personalRating = parseInt(data[`user_details`][`personal_rating`], 10) || 0;
    this.watchlist = Boolean(data[`user_details`][`watchlist`]);
    this.watched = Boolean(data[`user_details`][`already_watched`]);
    this.watchingDate = new Date(data[`user_details`][`watching_date`]) || null;
    this.favorite = Boolean(data[`user_details`][`favorite`]);
    this.comments = data[`comments`] || [];
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

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }
}
