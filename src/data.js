const getRandomNum = (count = 3) => {
  return Math.floor(Math.random() * count);
};

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

const eventData = {
  city: [`Chamonix`, `Karaganda`, `Huevokukuevo`, `Geneva`],
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
  get picture() {
    return `//picsum.photos/300/150?r=${Math.random()}`;
  },
  getEvent() {
    const pointsArray = [...this.point];
    const event = pointsArray[getRandomNum(pointsArray.length)];
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
  },
  get offer() {
    const setOffers = [...this.offers];
    const offers = [];
    for (let i = 0; i < getRandomNum(); i++) {
      let randomEl = setOffers[getRandomNum(setOffers.length)];
      if (!offers.includes(randomEl)) {
        offers.push(randomEl);
      }
    }
    return offers.map((el) => `<li>
                              <button class="trip-point__offer">${el}</button>
                            </li>`).join(``);
  },
  get description() {
    const strings = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`, `Abrakadabra`];
    let result = ``;
    for (let i = 0; i < strings.length; i++) {
      result += strings[getRandomNum(strings.length)] + ``;
    }
    return result;
  }
};

export {timesFilter, eventData};
