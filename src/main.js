import filterRender from './rendering/make-filter.js';
import {timesFilter, tripsPoint} from './data.js';
import Point from "./point/point";
import PointEdit from "./point/point-edit";

const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);

const startFilter = tripsPoint.everything;

const addElement = (parent, currentElement) => {
  parent.insertAdjacentHTML(`beforeEnd`, currentElement);
};

const addEvent = (parent, currentElement) => {
  parent.appendChild(currentElement.render());
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
  const point = new Point(data);
  const editPoint = new PointEdit(data);
  point.onClick = () => {
    editPoint.render();
    tripDay.replaceChild(editPoint.element, point.element);
    point.unrender();
  };

  editPoint.onSubmit = (newObject) => {
    point.title = newObject.title;
    point.city = newObject.city;
    point.price = newObject.price;
    point.icon = newObject.icon;
    point.time = newObject.time;
    point.offers = newObject.offers;
    point.isFavorite = newObject.isFavorite;

    point.update(data);
    point.render();
    tripDay.replaceChild(point.element, editPoint.element);
    editPoint.unrender();
  };

  document.addEventListener(`keydown`, function (e) {
    if (e.keyCode === 27) {
      point.render();
      tripDay.replaceChild(point.element, editPoint.element);
      editPoint.unrender();
    }
  });
  addEvent(parent, point);
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
