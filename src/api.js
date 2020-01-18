const AUTHORIZATION = `Basic eo0w590ik29889a52`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor() {
    this._endPoint = END_POINT;
    this._authorization = AUTHORIZATION;
  }

  getCards() {
    return this._load({url: `movies`})
      .then((response) => response.json());
  }

  updateCard(id, card) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(card.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json());
  }

  createComment(id, comment) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    });
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
