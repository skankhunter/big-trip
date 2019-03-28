import filterRender from './rendering/make-filter.js';
import {timesFilter, tripsPoints} from './data.js';
import Point from "./point/point";
import PointEdit from "./point/point-edit";

const tripForm = document.querySelector(`.trip-filter`);
const tripDay = document.querySelector(`.trip-day__items`);

const startFilter = tripsPoints;

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

const filterTasks = (tasks, filterName) => {
  switch (filterName) {
    case `everything`:
      return tasks;

    case `future`:
      return tasks.filter((it) => it.date > Date.now());

    case `past`:
      return tasks.filter((it) => it.date < Date.now());
  }
};

createAllFilters(timesFilter);

const clearBlock = (block) => {
  block.innerHTML = ``;
};

const filterForm = document.querySelector(`.trip-filter`);

const createEventElement = (parent, data) => {
  const point = new Point(data);
  const editPoint = new PointEdit(data);
  point.onClick = () => {
    editPoint.render();
    tripDay.replaceChild(editPoint.element, point.element);
    document.querySelector(`.flatpickr-input.form-control`).value = data.time;
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

    point.update(point);
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

  addEvent(parent, point);
};

const deleteTask = (task) => {
  for (let i = 0; i < tripsPoints.length; i++) {
    if (tripsPoints[i] === null) {
      continue;
    } else if (tripsPoints[i].token === task._token) {
      tripsPoints[i] = null;
      break;
    }
  }
};

const createAllEvents = (array) => {
  for (const el of array) {
    createEventElement(tripDay, el);
  }
};

filterForm.addEventListener(`change`, function (evt) {
  const filterName = evt.target.value;
  const filteredTasks = filterTasks(tripsPoints, filterName);
  clearBlock(tripDay);
  createAllEvents(filteredTasks);
});

createAllEvents(startFilter);
