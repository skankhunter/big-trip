import Filter from "./components/Filter";
import Point from "./point/point";
import PointEdit from "./point/point-edit";
// import {moneyChart, transportChart} from "./statistic";
import {timesFilter, tripsPoints} from './data.js';
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const HIDDEN_CLASS = `visually-hidden`;
const ACTIVE_STAT = `view-switch__item--active`;
const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);

const statBtns = document.querySelectorAll(`.view-switch__item`);
const pointsContainer = document.querySelector(`.main`);
const statisticContainer = document.querySelector(`.statistic`);

const allContainers = [pointsContainer, statisticContainer];

const closeAllContainer = () => allContainers.forEach((it) => it.classList.add(HIDDEN_CLASS));

const updateCharts = () => {
  const dataChartEventsMoney = getEventsMoney(tripsPoints);
  const dataChartEventsTransport = getEventsTransport(tripsPoints);

  moneyChart.data.datasets[0].data = dataChartEventsMoney.data;
  transportChart.data.datasets[0].data = dataChartEventsTransport.dataTransport;

  moneyChart.update();
  transportChart.update();
};


for (const btn of statBtns) {
  btn.addEventListener(`click`, function (e) {
    e.preventDefault();

    for (const itemBtn of statBtns) {
      itemBtn.classList.remove(ACTIVE_STAT);
    }
    closeAllContainer();
    e.target.classList.add(ACTIVE_STAT);
    const target = e.target.href.split(`#`)[1];

    const targetContainer = document.querySelector(`#${target}`);
    targetContainer.classList.remove(HIDDEN_CLASS);
    updateCharts();
  });
}

let startPoints = tripsPoints;

const addElement = (parent, currentElement) => {
  parent.appendChild(currentElement.render());
};

const clearBlock = (block) => {
  block.innerHTML = ``;
};

const filterTasks = (filterName) => {
  let tasksResult = startPoints;

  switch (filterName) {
    case `everything`:
      tasksResult = startPoints;
      break;

    case `future`:
      tasksResult = startPoints.filter((it) => it.date > Date.now());
      break;
    case `past`:
      tasksResult = startPoints.filter((it) => it.date < Date.now());
      break;
  }
  return tasksResult;
};

const createFilterElement = (parent, data) => {
  const filterElement = new Filter(data);

  const filterName = data.name;

  filterElement.onFilter = () => {
    const filteredTasks = filterTasks(filterName);
    clearBlock(tripDay);
    renderPoints(filteredTasks);
  };
  addElement(parent, filterElement);
};

const renderFilters = (data) => {
  for (const el of data) {
    createFilterElement(tripForm, el);
  }
};

renderFilters(timesFilter);

const createPointElement = (parent, data) => {
  const point = new Point(data);
  const editPoint = new PointEdit(data);
  point.onClick = () => {
    editPoint.render();
    tripDay.replaceChild(editPoint.element, point.element);
    document.querySelector(`.flatpickr-input.form-control`).value = data.time;
    point.unrender();
  };

  editPoint.onSubmit = (newObject) => {
    data.title = newObject.title;
    data.city = newObject.city;
    data.price = newObject.price;
    data.icon = newObject.icon;
    data.time = newObject.time;
    data.offers = newObject.offers;
    data.isFavorite = newObject.isFavorite;

    point.update(data);
    point.render();
    tripDay.replaceChild(point.element, editPoint.element);
    editPoint.unrender();
  };

  editPoint.onEsc = (initialObject) => {
    point.price = initialObject.price;
    editPoint.update(data);
    point.render();
    tripDay.replaceChild(point.element, editPoint.element);
    editPoint.unrender();
  };

  editPoint.onDelete = () => {
    deleteTask(editPoint);
    tripDay.removeChild(editPoint.element);
    editPoint.unrender();
  };
  addElement(parent, point);
};

const deleteTask = (task) => {
  startPoints = startPoints.filter((point) => point.token !== task._token);
};

const renderPoints = (data) => {
  for (const el of data) {
    createPointElement(tripDay, el);
  }
};

renderPoints(tripsPoints);


// Statistic

function getEventsMoney(events) {
  const types = {};
  const data = [];

  for (let event of events) {
    const prop = `${event.icon} ${event.eventType.toUpperCase()}`;
    if (!types.hasOwnProperty(prop)) {
      types[prop] = event.price;
    } else {
      types[prop] += event.price;
    }
  }

  for (let prop in types) {
    data.push(types[prop]);
  }

  return {
    uniqTypes: Object.keys(types),
    data
  };
}

function getEventsTransport(events) {
  const transportTypes = {};
  const otherTypes = {};
  const dataTransport = [];
  const dataOther = [];

  function updateTypes(obj, prop1, prop2) {
    const prop = `${prop1} ${prop2.toUpperCase()}`;
    if (!obj.hasOwnProperty(prop)) {
      obj[prop] = 1;
    } else {
      obj[prop] += 1;
    }
  }

  function updateData(arr, obj, prop) {
    prop.toUpperCase();
    arr.push(obj[prop]);
  }

  for (let event of events) {
    switch (event.eventType) {
      case `check-in`:
      case `sightseeing`:
      case `restaurant`:
        updateTypes(otherTypes, event.icon, event.eventType);
        break;
      default:
        updateTypes(transportTypes, event.icon, event.eventType);
    }
  }

  for (let prop in transportTypes) {
    updateData(dataTransport, transportTypes, prop);
  }

  for (let prop in otherTypes) {
    updateData(dataOther, otherTypes, prop);
  }

  return {
    transportTypes: Object.keys(transportTypes),
    otherTypes: Object.keys(transportTypes),
    dataTransport,
    dataOther
  };
}

const dataChartEventsMoney = getEventsMoney(tripsPoints);
const dataChartEventsTransport = getEventsTransport(tripsPoints);

const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
moneyCtx.height = BAR_HEIGHT * 6;
transportCtx.height = BAR_HEIGHT * 4;
timeSpendCtx.height = BAR_HEIGHT * 4;

// const updateData;

const moneyChart = new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: dataChartEventsMoney.uniqTypes,
    datasets: [{
      data: dataChartEventsMoney.data,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`
      }
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

const transportChart = new Chart(transportCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: dataChartEventsTransport.transportTypes,
    datasets: [{
      data: dataChartEventsTransport.dataTransport,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TRANSPORT`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});
