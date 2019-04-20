import Filter from "./components/Filter";
import TripDay from "./components/TripDay";
import PointEdit from "./point/point-edit";
import {updateCharts} from "./statistic";
import {api} from './backend-api';
import moment from "moment";
import Sorting from "./components/Sorting";
import ModelPoint from "./components/ModelPoint";

const tripPoints = document.querySelector(`.trip-points`);
const mainFilter = document.querySelector(`.trip-filter`);
const totalCost = document.querySelector(`.trip__total-cost`);

const pointsContainer = document.querySelector(`.main`);
const statisticContainer = document.querySelector(`.statistic`);

const tableButton = document.querySelector(`.view-switch__item:nth-child(1)`);
const statsButton = document.querySelector(`.view-switch__item:nth-child(2)`);

const mainSorting = document.querySelector(`.trip-sorting`);
const offersBlock = document.querySelector(`.trip-sorting__item--offers`);

const newTask = document.querySelector(`.new-event`);

let currentFilter;

const changeView = (evt) => {
  evt.preventDefault();
  tableButton.classList.toggle(`view-switch__item--active`);
  statsButton.classList.toggle(`view-switch__item--active`);
  pointsContainer.classList.toggle(`visually-hidden`);
  statisticContainer.classList.toggle(`visually-hidden`);
};

statsButton.addEventListener(`click`, (evt) => {
  changeView(evt);
  newTask.setAttribute(`disabled`, true);
  newTask.style = `opacity: 0;`;
  updateCharts(pointsByDay);
});

tableButton.addEventListener(`click`, (evt) => {
  newTask.removeAttribute(`disabled`);
  newTask.style = `opacity: 1;`;
  changeView(evt);
});

newTask.addEventListener(`click`, (e) => {
  e.target.setAttribute(`disabled`, true);

  const newPoint = {
    'id': String(Date.now()),
    'date_from': new Date(),
    'date_to': new Date(),
    'destination': {
      name: ``,
      description: ``,
      pictures: []
    },
    'base_price': 0,
    'is_favorite': false,
    'offers': [],
    'type': `bus`,
  };

  const point = new ModelPoint(newPoint);
  const pointEdit = new PointEdit(point);

  pointEdit.onSubmit = (newObject) => {
    newPoint.destination = {
      name: newObject.city,
      description: newObject.description,
      pictures: newObject.picture
    };
    newPoint.type = newObject.type.toLowerCase();
    newPoint.offers = newObject.offers;
    newPoint[`is_favorite`] = newObject.isFavorite;
    newPoint[`base_price`] = newObject.price;
    newPoint[`date_from`] = newObject.date.getTime();
    newPoint[`date_to`] = newObject.dateDue.getTime();

    const obj = ModelPoint.parsePoint(newPoint).toRAW();
    api.createPoint({point: obj})
      .then();

    api.getPoints()
      .then((points) => {
        sortPointsByDay(points);
        const sortedPoints = sortingPoints(pointsByDay, currentFilter);
        renderPoints(sortedPoints);
      });
  };
  // Мы еще ничего не отправили на сервер, поэтому тут хватит простого анрендера
  pointEdit.onDelete = () => {
    pointEdit.unrender();
    newTask.removeAttribute(`disabled`);
  };

  tripPoints.insertBefore(pointEdit.render(), tripPoints.firstChild);

  const priceInput = pointEdit._element.querySelector(`.point__input[name="price"]`);
  priceInput.removeAttribute(`readonly`);
});

const filtersRawData = [
  {name: `everything`, id: `filter-everything`, checked: true},
  {name: `future`, id: `filter-future`, checked: false},
  {name: `past`, id: `filter-past`, checked: false},
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

const sortingRawData = [
  {name: `event`, id: `sorting-event`, checked: true},
  {name: `time`, id: `sorting-time`, checked: false},
  {name: `price`, id: `sorting-price`, checked: false},
];

function renderSorting(sortingData) {
  sortingData.forEach((rawSorting) => {
    let sorting = new Sorting(rawSorting);
    mainSorting.insertBefore(sorting.render(), offersBlock);

    sorting.onSorting = () => {
      const sortedPoints = sortingPoints(pointsByDay, sorting._id);
      tripPoints.innerHTML = ``;
      renderPoints(sortedPoints);
    };
  });
}

renderSorting(sortingRawData);

const sortingPoints = (data, sortingName) => {
  currentFilter = sortingName;
  switch (sortingName) {
    case `sorting-event`:
      return sortingByFilter(data, `type`);
    case `sorting-time`:
      return sortingByFilter(data, `duration`);
    case `sorting-price`:
      return sortingByFilter(data, `price`);
  }
};

function sortingByFilter(data, property) {
  data.forEach((day) => {
    if (day.length > 1) {
      day.sort(function (a, b) {
        if (a[property] > b[property]) {
          return 1;
        }
        if (a[property] < b[property]) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });
    }
  });

  return data;
}

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
  tripPoints.innerHTML = ``;
  data.forEach((dayPoints) => {
    let day = new TripDay(dayPoints);
    tripPoints.appendChild(day.render());

    day.onDelete = () => {
      api.getPoints()
        .then((remainPoints) => {
          sortPointsByDay(remainPoints);
          const sortedPoints = sortingPoints(pointsByDay, currentFilter);
          renderPoints(sortedPoints);
        });
    };

    day.onSubmit = () => {
      api.getPoints()
        .then((remainPoints) => {
          calculatingTotalPrice(remainPoints);
        });
    };
  });
};

function calculatingTotalPrice(dayPoints) {
  let result = 0;
  for (const day of dayPoints) {
    result += Number(day.price);
  }

  totalCost.textContent = `€ ${result}`;
}

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
    calculatingTotalPrice(pointsData);
  })
  .catch(() => {
    msg.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
