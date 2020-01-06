export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`] || ``;
    this.originalTitle = data[`alternative_title`] || ``;
    this.rating = parseInt(data[`total_rating`], 10) || 0;
    this.poster = data[`poster`] || ``;
    this.age = parseInt(data[`age_rating`], 10) || 0;
    this.director = data[`director`] || ``;
    this.writers = new Set(data[`writers`] || []);
    this.actors = new Set(data[`actors`] || []);
    this.date = new Date(data[`release`][`date`]) || null;
    this.country = data[`release`][`release_country`] || ``;
    this.runtime = parseInt(data[`runtime`], 10) || 0;
    this.genre = new Set(data[`genre`] || []);
    this.description = data[`description`] || ``;
    this.personalRating = parseInt(data[`personal_rating`], 10) || 0;
    this.watchlist = Boolean(data[`watchlist`]);
    this.watched = Boolean(data[`already_watched`]);
    this.watchingDate = new Date(data[`watching_date`]) || null;
    this.favorite = Boolean(data[`favorite`]);
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

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
