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
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
    `check-in`,
    `sightseeing`,
    `restaurant`
  ]),
  iconPoint: {
    'taxi': `🚕`,
    'bus': `🚌`,
    'train': `🚂`,
    'ship': `🛳️`,
    'transport': `🚊`,
    'drive': `🚗`,
    'flight': `✈`,
    'check-in': `🏨`,
    'sightseeing': `🏛`,
    'restaurant': `🍴`
  },
  dueData: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  offers: {
    'taxi': [{label: `Add luggage`, checked: false, cost: `23`}, {label: `35345`, checked: false, cost: `23`}],
    'bus': [{label: `test`, checked: false, cost: `23`}, {label: `test`, checked: false, cost: `23`}],
    'train': [{label: `Add 123`, checked: false, cost: `23`}, {label: `asdfasdf`, checked: false, cost: `23`}],
    'ship': [{label: `Adasdfasd luggage`, checked: false, cost: `23`}, {label: `234235`, checked: false, cost: `23`}],
    'transport': [{label: `Add xcvbcxn`, checked: false, cost: `23`}, {label: `adsfgdfh`, checked: false, cost: `23`}],
    'drive': [{label: `Add xcvnxcn`, checked: false, cost: `23`}, {label: `nbvmcbnm`, checked: false, cost: `23`}],
    'flight': [{label: `Add something`, checked: false, cost: `23`}, {label: `vip`, checked: false, cost: `23`}],
    'check-in': [{label: `Add luggage`, checked: false, cost: `23`}, {label: `35345`, checked: false, cost: `23`}],
    'sightseeing': [{label: `Add luggage`, checked: false, cost: `23`}, {label: `35345`, checked: false, cost: `23`}],
    'restaurant': [{label: `Add desert`, checked: false, cost: `23`}, {label: `35345`, checked: false, cost: `23`}]
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
        case `check-in`:
        case `sightseeing`:
        case `restaurant`:
          return {title: `${event} into a`, icon: icons[event], offer: this.offers[event]};
        default:
          return {title: `${event} to`, icon: icons[event], offer: this.offers[event]};
      }
    }
    return null;
  },
  get description() {
    const descriptions = [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
      `Abrakadabra`
    ];
    shuffleArray(descriptions);
    return descriptions.join(` `);
  },
  time: `12:00`,
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
