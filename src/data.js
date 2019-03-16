import {getRandomNum, shuffleArray} from './helpers/helpers';
import {createPointData} from "./helpers/create-point";
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
  offers: {
    'Taxi': [`Add luggage`, `35345`],
    'Bus': [`qfgfd`, `Switch to comfort class`],
    'Train': [`Afglnlf`, `Switch to comfort class`],
    'Ship': [`dfghncv`, `fghdfgh`],
    'Transport': [`Add luggage`, `123`],
    'Drive': [`xcvbxcvb`, `xvbxcvb`],
    'Flight': [`Add luggage`, `Switch to comfort class`],
    'Check-in': [`Add meal`, `Add alcohol`],
    'Sightseeing': [`Add meal`, `Add alcohol`],
    'Restaurant': [`Add meal`, `Add alcohol`]
  },
  get price() {
    return Math.floor(Math.random() * 100);
  },
  get city() {
    return [...this.cities];
  },
  get picture() {
    return `//picsum.photos/300/150?r=${Math.random()}`;
  },
  get offerPrice() {
    return Math.floor(Math.random() * 30);
  },
  getEvent() {
    const events = [...this.point];
    const event = events[getRandomNum(events.length)];
    const icons = this.iconPoint;
    if (icons.hasOwnProperty(event)) {
      switch (event) {
        case `Check-in`:
        case `Sightseeing`:
        case `Restaurant`:
          return {title: `${event} into a`, icon: icons[event], offer: this.offers[event]};
        default:
          return {title: `${event} to`, icon: icons[event], offer: this.offers[event]};
      }
    }
    return null;
  },
  get offer() {
    const setOffers = [...this.offers];
    shuffleArray(setOffers);
    const randomNum = getRandomNum(3);

    return setOffers.slice(0, randomNum);
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

const generateData = () => {
  const trips = {};
  for (const el of timesFilter) {
    trips[`${el.id}`] = createPointData(el.count, eventData);
  }
  return trips;
};

const tripsPoint = generateData();

export {timesFilter, tripsPoint};
