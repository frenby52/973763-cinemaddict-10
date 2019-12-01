const getUserRank = (rank) => {
  if (rank >= 1 && rank <= 10) {
    return `novice`;
  } else if (rank >= 11 && rank <= 20) {
    return `fan`;
  } else if (rank >= 21) {
    return `movie buff`;
  }
  return ``;
};

export const createUserRatingTemplate = (data) => {
  const rank = getUserRank(data);
  return (`<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};
