import filterRender from './make-filter.js';
import eventRender from './make-card.js';
import {timesFilter, tripsPoint} from './data.js';

const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);

const startFilter = tripsPoint.everything;

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

const createEventElement = (parent, data) => {
  let currentCard = eventRender(data);
  addElement(parent, currentCard);
};

const createAllEvents = (array) => {
  for (const el of array) {
    createEventElement(tripDay, el);
  }
};

const getCurrentFilter = (target) => {
  const currentId = target.getAttribute(`id`);
  return currentId.split(`-`)[1];
};

const renderPoints = (target, data) => {
  const filter = getCurrentFilter(target);
  createAllEvents(data[`${filter}`]);
};

for (const el of filterRadio) {
  el.addEventListener(`change`, function (evt) {
    const target = evt.target;
    clearBlock(tripDay);
    renderPoints(target, tripsPoint);
  });
}

createAllEvents(startFilter);
