import EventComponent from "../components/EventComponent";

class Point extends EventComponent {
  constructor(data) {
    super();
    this._id = data.id;
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._description = data.description;
    this._picture = data.picture;
    this._price = data.price;
    this._offers = data.offers;
    this._day = data.day;
    this._month = data.month;
    this._uniqueDay = data.uniqueDay;
    this._time = data.time;
    this._date = data.date;
    this._isFavorite = data.isFavorite;
    this._dateDue = data.dateDue;

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
      <i class="trip-icon">${this._typeIcon}</i>
      <h3 class="trip-point__title">${this._type} to ${this._city}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${this._time.from}&nbsp;&mdash; ${this._time.due}</span>
        <span class="trip-point__duration">${this._time.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
      ${ this._offers.map((offer) => {
    if (offer.accepted) {
      return `<li>
                  <button class="trip-point__offer">${offer.title || ``}</button>
                </li>`;
    } else {
      return ``;
    }
  }).join(``).trim()
}
      </ul>
    </article>`.trim();
  }

  bind() {
    this._element.
      addEventListener(`click`, this._onClickHandler);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onClickHandler);
  }

  update(data) {
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._price = data.price;
    this._offers = data.offers;
    this._time = data.time;
    this._date = data.date;
    this._dateDue = data.dateDue;
  }
}

export default Point;

