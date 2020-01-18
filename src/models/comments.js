import API from "../api";

export default class Comments {
  constructor(comment) {
    if (comment) {
      this.id = comment[`id`] || ``;
      this.author = comment[`author`] || ``;
      this.comment = comment[`comment`];
      this.date = new Date(comment[`date`]) || null;
      this.emoji = comment[`emotion`] || ``;
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

  static parseComment(comment) {
    return new Comments(comment);
  }

  static parseComments(comment) {
    return comment.map(Comments.parseComment);
  }
}
