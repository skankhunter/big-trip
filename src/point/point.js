
import EventComponent from "../components/EventComponent";

class Point extends EventComponent {
  constructor(data) {
    super();
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

    this._onClickHandler = this._onClickHandler.bind(this);
  }

  _onClickHandler() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
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
            <span class="trip-point__timetable">${this._time}</span>
            <span class="trip-point__duration">${this._time}m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
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
    this._element.
      addEventListener(`click`, this._onClickHandler);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClickHandler);
  }

  update(data) {
    this._title = data.title;
    this._city = data.city;
    this._price = data.price;
    this._icon = data.icon;
    this._time = data.time;
    this._offers = data.offers;
  }
}

export default Point;

