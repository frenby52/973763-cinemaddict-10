export default class Comments {
  constructor(data) {

    this.id = data[`id`] || ``;

    this.author = data[`author`] || ``;
    this.comment = data[`comment`];
    this.date = new Date(data[`date`]) || null;
    this.emoji = data[`emotion`] || ``;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date ? this.date.toISOString() : null,
      'emotion': this.emoji
    };
  }

  static parseComment(data) {
    return new Comments(data);
  }

  static parseComments(data) {
    return data.map(Comments.parseComment);
  }
}
