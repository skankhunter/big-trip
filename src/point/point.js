import {createElement} from "../helpers/сreate-element";

class Point {
  constructor(data) {
    this._city = data.city;
    this._title = data.title;
    this._picture = data.picture;
    this._event = data.event;
    this._price = data.price;
    this._offers = data.offers;
    this._icon = data.icon;
    this._description = data.description;
    this._date = data.dueData;
    this._time = data.time;

    this._element = null;
    this._state = {
      isEdit: false
    };

    this._onClickHandler = this._onClickHandler.bind(this);
  }

  _onClickHandler() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `
        <article class="trip-point">
          <i class="trip-icon">${this._icon}</i>
          <h3 class="trip-point__title">${this._title} ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._time.hour}:${this._time.minute}&nbsp;&mdash; ${this._time.hour + 1}:00</span>
            <span class="trip-point__duration">${this._time.hour + 1 - this._time.hour}h ${this._time.minute}m</span>
          </p>
          <p class="trip-point__price">${this._price}</p>
          <ul class="trip-point__offers">
             ${(Array.from(this._offers).map((offer) => (`
                      <li>
                         <button class="trip-point__offer">${offer}</button>
                      </li>`.trim()))).join(``)}
          </ul>
      </article>
    `;
  }

  bind() {
    this._element.addEventListener(`click`, this._onClickHandler);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClickHandler);
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export default Point;

