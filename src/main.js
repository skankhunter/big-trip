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

function getRandomNum()  {
  return Math.floor(Math.random() * 10);
}

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const addElement = (parent, currentElement) => {
  parent.insertAdjacentHTML(`beforeEnd`, currentElement);
};

const filterRender = (id, count, checked = false, disabled = false) => {
  const input = `<input type="radio" id="filter-${id}" ${disabled && `disabled`} value="${id}" name="filter" ${checked && `checked`}/>`;
  const label = `<label for="filter-${id}" class="trip-filter__item">${id}</label>`;
  return `${input} ${label}`;
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

const eventRender = (data) => {
  console.log(data);
  return `<article class="trip-point">
         <i class="trip-icon">${data.icon}</i>
          <h3 class="trip-point__title">${data.title}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
            <span class="trip-point__duration">1h 30m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;20</p>
          <ul class="trip-point__offers">
              <li>
                <button class="trip-point__offer">${data.offers[0]}</button>
              </li>
              <li>
                <button class="trip-point__offer">${data.offers[1]}</button>
              </li>
            </ul>
   </article>`;
};

const clearBlock = (block) => {
  block.innerHTML = ``;
};

const filterLabel = document.querySelectorAll(`.trip-filter__item`);

for (let el of filterLabel) {
  el.addEventListener(`click`, function () {
    clearBlock(tripDay);
    onClickHandler();
  });
}

function onClickHandler() {
  const randomNum = getRandomNum();
  for (let i = 0; i < randomNum; i++) {
    const currentEvent = getRandomElement(dataStorage);
    const eventCard = eventRender(currentEvent);
    addElement(tripDay, eventCard);
  }
}
