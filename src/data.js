const getRandomNum = (count) => {
  return Math.floor(Math.random() * count);
};

const getRandomElement = (array) => {
  return array[getRandomNum(array.length)];
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const timesFilter = [
  {
    id: `everything`,
    checked: true,
    disabled: false,
    count: 7
  },
  {
    id: `future`,
    checked: false,
    disabled: true,
    count: 0
  },
  {
    id: `past`,
    checked: false,
    disabled: false,
    count: 10
  }
];

const eventData = {
  cities: new Set([`Chamonix`, `Karaganda`, `Huevokukuevo`, `Geneva`]),
  point: new Set([
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ]),
  iconPoint: {
    'Taxi': `🚕`,
    'Bus': `🚌`,
    'Train': `🚂`,
    'Ship': `🛳️`,
    'Transport': `🚊`,
    'Drive': `🚗`,
    'Flight': `✈`,
    'Check-in': `🏨`,
    'Sightseeing': `🏛`,
    'Restaurant': `🍴`
  },
  dueData: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  offers: new Set([
    `Add luggage`,
    `Switch to comfort class`,
    `Add meal`,
    `Choose seats`]),
  get price() {
    return Math.floor(Math.random() * 100);
  },
  get city() {
    return [...this.cities];
  },
  get picture() {
    return `//picsum.photos/300/150?r=${Math.random()}`;
  },
  getEvent() {
    const points = [...this.point];
    const event = points[getRandomNum(points.length)];
    const icons = this.iconPoint;
    if (icons.hasOwnProperty(event)) {
      switch (event) {
        case `Check-in`:
        case `Sightseeing`:
        case `Restaurant`:
          return {title: `${event} into a`, icon: icons[event]};
        default:
          return {title: `${event} to`, icon: icons[event]};
      }
    }
    return null;
  },
  get offer() {
    const setOffers = [...this.offers];
    shuffleArray(setOffers);
    const randomNum = getRandomNum(3);

    return setOffers.slice(0, randomNum).map((el) => `<li>
                              <button class="trip-point__offer">${el}</button>
                            </li>`).join(``);
  },
  get description() {
    const descriptions = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`, `Abrakadabra`];
    shuffleArray(descriptions);
    return descriptions.join(` `);
  },
  get time() {
    const hour = getRandomNum(24);
    const minute = getRandomNum(59);
    if (minute < 10) {
      return {hour, minute: `0${minute}`};
    } else {
      return {hour, minute};
    }
  }
};

const createPointData = (count, data) => {
  const newPoints = [];
  for (let i = 0; i <= count; i++) {
    let tempData = data.getEvent();
    newPoints.push({
      city: getRandomElement(data.city),
      title: tempData.title,
      picture: data.picture,
      event: tempData.event,
      price: data.price,
      offers: data.offer,
      icon: tempData.icon,
      description: data.description,
      date: data.dueData,
      time: data.time
    });
  }
  return newPoints;
};

const allObjects = {};

const generateData = () => {
  for (const el of timesFilter) {
    allObjects[`${el.id}`] = createPointData(el.count, eventData);
  }
  return allObjects;
};

generateData();

export {timesFilter, allObjects};
