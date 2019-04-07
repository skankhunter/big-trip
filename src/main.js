import Filter from "./components/Filter";
import TripDay from "./components/TripDay";
import PointEdit from "./point/point-edit";
import {updateCharts} from "./statistic";
import {api} from './backend-api';
import moment from "moment";

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);

const pointsContainer = document.querySelector(`.main`);
const statisticContainer = document.querySelector(`.statistic`);

const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);

const changeView = (evt) => {
  evt.preventDefault();
  tableButton.classList.toggle(`view-switch__item--active`);
  statsButton.classList.toggle(`view-switch__item--active`);
  pointsContainer.classList.toggle(`visually-hidden`);
  statisticContainer.classList.toggle(`visually-hidden`);
};

statsButton.addEventListener(`click`, (evt) => {
  changeView(evt);
  updateCharts(pointsByDay);
});

tableButton.addEventListener(`click`, (evt) => {
  changeView(evt);
});

const filtersRawData = [
  {name: `everything`, id: `filter-everything`, isChecked: true},
  {name: `future`, id: `filter-future`, isChecked: false},
  {name: `past`, id: `filter-past`, isChecked: false},
];

let pointsByDay = new Map();
// Сортировка точек по дням
const sortPointsByDay = (data) => {
  pointsByDay.clear();
  for (let point of data) {
    if (!pointsByDay.has(point.uniqueDay)) {
      pointsByDay.set(point.uniqueDay, [point]);
    } else {
      pointsByDay.get(point.uniqueDay).push(point);
    }
  }
  pointsByDay = new Map([...pointsByDay.entries()].sort());
};

const filterPoints = (data, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return data;
    case `filter-future`:
      return data.filter((it) => moment(it.date) > moment());
    case `filter-past`:
      return data.filter((it) => moment(it.date) < moment());
  }
  return data;
};

function renderFilters(filtersData) {
  filtersData.forEach((rawFilter) => {
    let filter = new Filter(rawFilter);
    mainFilter.appendChild(filter.render());

    filter.onFilter = () => {
      const filterName = filter._id;
      api.getPoints()
        .then((allPoints) => {
          const filteredPoints = filterPoints(allPoints, filterName);
          tripPoints.innerHTML = ``;
          sortPointsByDay(filteredPoints);
          renderPoints(pointsByDay);
        });
    };
  });
}


const renderPoints = (data) => {
  data.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      api.getPoints()
        .then((remainPoints) => {
          sortPointsByDay(remainPoints);
          renderPoints(pointsByDay);
        });
    };
  });
};

renderFilters(filtersRawData);

let msg = document.createElement(`div`);
msg.innerHTML = `Loading route...`;
msg.classList.add(`trip-points__message`);
tripPoints.appendChild(msg);

Promise.all([api.getPoints(), api.getDestinations(), api.getOffers()])
  .then(([pointsData, destinations, offers]) => {
    tripPoints.removeChild(msg);
    PointEdit.setDestinations(destinations);
    PointEdit.setAllOffers(offers);
    sortPointsByDay(pointsData);
    renderPoints(pointsByDay);
  })
  .catch(() => {
    msg.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
