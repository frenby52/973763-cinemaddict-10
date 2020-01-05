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

const createStatisticsTemplate = (data) => {
  const genres = getSortedStats(data);
  const topGenre = genres[0] ? genres[0].genre : `-`;
  const totalDuration = moment.duration(data.reduce((acc, it) => acc + (it.runtime * 60 * 1000), 0));

  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(data.length)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
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
    this._chart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._watchedMovies);
  }

  _renderChart() {
    // console.log(moment().subtract(7, `d`))
    // console.log(moment().startOf(`day`))
    // console.log(moment(1518131116001).format(`YYYY/MM/DD hh:mm`))
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    this._chart = renderChart(ctx, this._watchedMovies);

  }

  rerender() {
    this._watchedMovies = this._moviesModel.getCardsAll().filter((it) => it.watched);

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

  recoveryListeners() {}


}
