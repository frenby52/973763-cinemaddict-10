import API from "../api";

export default class Comments {
  constructor(data) {
    if (data) {
      this.id = data[`id`] || ``;
      this.author = data[`author`] || ``;
      this.comment = data[`comment`];
      this.date = new Date(data[`date`]) || null;
      this.emoji = data[`emotion`] || ``;
    }

    this._api = new API();
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date ? this.date.toISOString() : null,
      'emotion': this.emoji
    };
  }

  getComments(id) {
    return this._api.getComments(id);
  }

  createComment(id, comment) {
    return this._api.createComment(id, comment);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }

  static parseComment(data) {
    return new Comments(data);
  }

  static parseComments(data) {
    return data.map(Comments.parseComment);
  }
}
