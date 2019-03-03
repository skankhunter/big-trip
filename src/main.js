import filterRender from './make-filter.js';
import eventRender from './make-card.js';
import {timesFilter, eventData} from './data.js';

const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);

const dataStorage = [
  {
    title: `Taxi to Airport`,
    icon: `🚕`,
    offers: [`Order UBER +€ 20`, `Upgrade to business +€ 20`]
  },
  {
    title: `Flight to Geneva`,
    icon: `✈️`,
    offers: [`Upgrade to business +€ 20`, `Select meal +€ 20`]
  },
  {
    title: `Drive to Chamonix`,
    icon: `🚗`,
    offers: [`Rent a car +€ 200`, ``]
  },
  {
    title: `Check into a hotel`,
    icon: `🏨`,
    offers: [`Add breakfast +€ 20`, ``]
  }
];
const startCount = 7;
const randomRange = 10;

function getRandomNum() {
  return Math.floor(Math.random() * 10);
}

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const addElement = (parent, currentElement) => {
  parent.insertAdjacentHTML(`beforeEnd`, currentElement);
};

const createFilterElement = (parent, id, checked, disabled) => {
  const currentFilter = filterRender(id, checked, disabled);
  addElement(parent, currentFilter);
};

const createAllFilters = (array) => {
  for (const el of array) {
    createFilterElement(tripForm, el.id, el.checked, el.disabled);
  }
};

createAllFilters(timesFilter);

const clearBlock = (block) => {
  block.innerHTML = ``;
};

const filterRadio = document.getElementsByName(`filter`);

const createEventData = (count, data) => {
  const events = [];
  for (let i = 0; i < count; i++) {
    let tempData = data.getEvent();
    events.push({
      city: getRandomElement(data.city),
      title: tempData.title,
      picture: data.picture,
      event: tempData.event,
      price: data.price,
      offers: data.offer,
      icon: tempData.icon,
      description: data.description
    });
  }

  return events;
};

const createEventElement = (parent, data) => {
  let currentCard = eventRender(data);
  addElement(parent, currentCard);
};

const createAllEvents = (array) => {
  for (const el of array) {
    createEventElement(tripDay, el);
  }
};

const createNewEvents = (count) => {
  const currentDataArray = createEventData(count, eventData);
  createAllEvents(currentDataArray);
};

function onClickHandler() {
  const randomNum = getRandomNum(randomRange);
  createNewEvents(randomNum);
}

for (let el of filterRadio) {
  el.addEventListener(`change`, function () {
    clearBlock(tripDay);
    onClickHandler();
  });
}

createNewEvents(startCount);


