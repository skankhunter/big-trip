import filterRender from './make-filter.js';
import eventRender from './make-card.js';

const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);
const timesFilter = [
  {
    id: `everything`,
    checked: true,
    disabled: false
  },
  {
    id: `future`,
    checked: false,
    disabled: true
  },
  {
    id: `past`,
    checked: false,
    disabled: false
  }
];
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


const renderAllCards = (count) => {
  for (let i = 0; i < count; i++) {
    const currentEvent = getRandomElement(dataStorage);
    const eventCard = eventRender(currentEvent);
    addElement(tripDay, eventCard);
  }
};

function onClickHandler() {
  const randomNum = getRandomNum(randomRange);
  renderAllCards(randomNum);
}

for (let el of filterRadio) {
  el.addEventListener(`change`, function () {
    clearBlock(tripDay);
    onClickHandler();
  });
}


