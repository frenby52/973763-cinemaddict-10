import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import {getUserRank} from "../util";

const getSortedStats = (data) => {
  const allGenres = [];
  data.forEach((item) =>
    item.genre.forEach((it) => {
      allGenres.push(it);
    })
  );

  const uniqueGenres = new Set(allGenres);

  const genresStats = [...uniqueGenres].map((it) => {
    let qty = 0;
    allGenres.forEach((it2) => {
      if (it2 === it) {
        qty++;
      }
    });
    return {genre: it, count: qty};
  });

  return genresStats.sort((a, b) => b.count - a.count);
};

const renderChart = (ctx, movies) => {
  const genres = getSortedStats(movies);
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres.map((it) => it.genre),
      datasets: [{
        data: genres.map((it) => it.count),
        backgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 30,
        borderWidth: 1,
      }]
    },
    options: {
      layout: {
        padding: {
          left: 100
        }
      },
      plugins: {
        datalabels: {
          font: {
            size: 18
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 18
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (data, filter, watchedMovies) => {
  const genres = getSortedStats(data);
  const topGenre = genres[0] ? genres[0].genre : `-`;
  const totalDuration = moment.duration(data.reduce((acc, it) => acc + (it.runtime * 60 * 1000), 0));

  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(watchedMovies.length)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filter === `all-time` ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filter === `today` ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filter === `week` ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filter === `month` ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filter === `year` ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${moment.duration(totalDuration).hours()}<span class="statistic__item-description">h</span>${moment.duration(totalDuration).minutes()}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this._watchedMovies = this._moviesModel.getCardsAll().filter((it) => it.watched);
    this._filteredData = this._watchedMovies;
    this._chart = null;
    this._filter = `all-time`;
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);

    this._renderChart();
    this._setFilterListener();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filteredData, this._filter, this._watchedMovies);
  }

  _renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    this._chart = renderChart(ctx, this._filteredData);
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  show() {
    super.show();

    this.rerender();
  }

  _setFilterListener() {
    const todayPeriod = moment().startOf(`day`);
    const weekPeriod = moment().subtract(7, `d`);
    const monthPeriod = moment().subtract(30, `d`);
    const yearPeriod = moment().subtract(365, `d`);

    const getDataForPeriod = (data, startPeriod) => data.filter((it) => it.watchingDate > startPeriod);

    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      switch (evt.target.value) {
        case `today`:
          this._filteredData = getDataForPeriod(this._watchedMovies, todayPeriod);
          break;
        case `week`:
          this._filteredData = getDataForPeriod(this._watchedMovies, weekPeriod);
          break;
        case `month`:
          this._filteredData = getDataForPeriod(this._watchedMovies, monthPeriod);
          break;
        case `year`:
          this._filteredData = getDataForPeriod(this._watchedMovies, yearPeriod);
          break;
        default:
          this._filteredData = this._watchedMovies;
      }
      this._filter = evt.target.value;

      this.rerender();
    });
  }

  _onDataChange() {
    this._watchedMovies = this._moviesModel.getCardsAll().filter((it) => it.watched);
    this._filteredData = this._watchedMovies;
    this._filter = `all-time`;
  }

  recoveryListeners() {
    this._setFilterListener();
  }
}
