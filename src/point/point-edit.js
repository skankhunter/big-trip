import EventComponent from "../components/EventComponent";
import {createElement} from "../helpers/сreate-element";
import flatpickr from 'flatpickr';
import moment from 'moment';

class PointEdit extends EventComponent {
  constructor(data) {
    super();
    this._token = data.token;
    this._eventType = data.eventType;
    this._city = data.city;
    this._title = data.title;
    this._picture = data.picture;
    this._price = data.price;
    this._offers = data.offers;
    this._offerPrice = data.offerPrice;
    this._offersList = data.offersList;
    this._icon = data.icon;
    this._description = data.description;
    this._date = data.dueData;
    this._time = data.time;
    this._icons = data.icons;
    this._startPrice = data.price;

    this._state.isFavorite = false;
    this._state.checked = false;

    this._onSubmit = null;
    this._onEsc = null;
    this._onDelete = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onFormDelete = this._onFormDelete.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onOfferChange = this._onOfferChange.bind(this);
    this._onEventChange = this._onEventChange.bind(this);
  }

  _processForm(formData) {
    const entry = {
      title: this._title,
      price: this._price,
      city: this._city,
      isFavorite: false,
      offers: this._offers,
      icon: this._icon,
      time: this._time
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    return entry;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onKeyDown(e) {
    if (e.keyCode === 27) {
      const initData = {
        price: this._startPrice
      };

      this._onEsc(initData);
    }
  }

  _onSubmitButtonClick(e) {
    e.preventDefault();

    const formData = new FormData(this._element.querySelector(`.trip-day__items form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onFormDelete(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  _onCheckedChange(e) {
    for (let offer of this._offers) {
      if (e.target.id === offer.label.split(` `).join(`-`).toLocaleLowerCase()) {
        offer.checked = e.currentTarget.checked;
      }
    }
  }

  _onFavoriteChange() {
    this._state.isFavorite = !this._state.isFavorite;
  }

  _onEventChange(e) {
    const icons = this._icons;
    const offers = this._offersList;
    for (let prop in icons) {
      if (prop.toLocaleLowerCase() === e.target.value) {
        this._icon = icons[prop];
        switch (e.target.value) {
          case `check-in`:
          case `sightseeing`:
          case `restaurant`:
            this._title = e.target.value + ` into `;
            break;
          default:
            this._title = e.target.value + ` to `;
            break;
        }
      }
    }

    this._price = this._startPrice;
    this._offers = offers[e.target.value];
    for (let offer of this._offers) {
      offer.checked = false;
    }

    this._partialUpdate();
    this.bind();
  }

  _onOfferChange(e) {
    this._price = Number(this._price);
    if (e.target.checked === true) {
      this._price += Number(e.target.value);
    } else {
      this._price -= Number(e.target.value);
    }

    this._onCheckedChange(e);
    this._partialUpdate();
    this.bind();
  }

  _partialUpdate() {
    const currentElement = createElement(this.template);
    let fieldContainer = document.createElement(`div`).innerHTML;
    fieldContainer = currentElement;
    this._element.innerHTML = fieldContainer.firstElementChild.outerHTML;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _createCycleListeners() {
    const offersInput = this._element.querySelectorAll(`.point__offers-input`);
    for (let i = 0; i < offersInput.length; i++) {
      offersInput[i].addEventListener(`change`, this._onOfferChange);
    }

    const travelSelect = this._element.querySelectorAll(`.travel-way__select-input`);
    for (let i = 0; i < travelSelect.length; i++) {
      travelSelect[i].addEventListener(`click`, this._onEventChange);
    }
  }

  _removeCycleListeners() {
    const offersInput = this._element.querySelectorAll(`.point__offers-input`);
    for (let i = 0; i < offersInput.length; i++) {
      offersInput[i].removeEventListener(`change`, this._onOfferChange);
    }

    const travelSelect = this._element.querySelectorAll(`.travel-way__select-input`);
    for (let i = 0; i < travelSelect.length; i++) {
      travelSelect[i].removeEventListener(`click`, this._onEventChange);
    }
  }

  bind() {
    const pointInput = this.element.querySelector(`input[name="time"]`);

    this._element.addEventListener(`submit`, this._onSubmitButtonClick);

    document.addEventListener(`keydown`, this._onKeyDown);

    this._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onFavoriteChange);

    this._element.querySelector(`form`).addEventListener(`reset`, this._onFormDelete);

    flatpickr(pointInput, {
      mode: `range`,
      time24hr: true,
      enableTime: true,
      minDate: `2018-03-01`,
      maxDate: `2018-03-01`,
      noCalendar: false,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `H:i`
    });

    this._createCycleListeners();
  }

  unbind() {
    this._element.removeEventListener(`submit`, this._onSubmitButtonClick);

    document.removeEventListener(`keydown`, this._onKeyDown);

    this._element.querySelector(`form`).removeEventListener(`reset`, this._onFormDelete);

    this._element.querySelector(`.point__offers-input`)
      .removeEventListener(`change`, this._onOfferChange);

    this._removeCycleListeners();
  }

  update(data) {
    this._title = data.title;
    this._city = data.city;
    this._price = data.price;
    this._icon = data.icon;
    this._time = data.time;
    this._offers = data.offers;
    this._state.isFavorite = data.isFavorite;
  }

  static createMapper(target) {
    return {
      price: (value) => {
        target.price = value;
      },
      destination: (value) => {
        target.city = value;
      },
      favorite: () => {
        target.isFavorite = true;
      },
      time: (value) => {
        target.time = value;
      },
      icon: (value) => {
        target.icon = value;
      }
    };
  }

  get template() {
    return `
        <article class="point">
          <form action="" method="get">
            <header class="point__header">
              <label class="point__date">
                choose day
                <input class="point__input" type="text" placeholder="MAR 18" name="day">
              </label>
        
              <div class="travel-way">
                <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>
        
                <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
        
                <div class="travel-way__select">
                  <div class="travel-way__select-group">
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                    <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
        
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                    <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
        
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                    <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
        
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight">
                    <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                  </div>
        
                  <div class="travel-way__select-group">
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                    <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
        
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sightseeing">
                    <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                  </div>
                </div>
              </div>
        
              <div class="point__destination-wrap">
                <label class="point__destination-label" for="destination">${this._title}</label>
                <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
                <datalist id="destination-select">
                  <option value="airport"></option>
                  <option value="Geneva"></option>
                  <option value="Chamonix"></option>
                  <option value="Karaganda"></option>
                  <option value="Huevokukuevo"></option>
                </datalist>
              </div>
        
              <label class="point__time">
                choose time
                <input class="point__input" type="text" value="${this._time}" name="time" placeholder="00:00 — 00:00">
              </label>
        
              <label class="point__price">
                write price
                <span class="point__price-currency">€</span>
                <input class="point__input" type="text" value="${this._price}" name="price" readonly>
              </label>
        
              <div class="point__buttons">
                <button class="point__button point__button--save" type="submit">Save</button>
                <button class="point__button" type="reset">Delete</button>
              </div>
        
              <div class="paint__favorite-wrap">
                <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._state.isFavorite ? `checked` : ``}>
                <label class="point__favorite" for="favorite">favorite</label>
              </div>
            </header>
        
            <section class="point__details">
              <section class="point__offers">
                <h3 class="point__details-title">offers</h3>
        
                <div class="point__offers-wrap">
                ${(Array.from(this._offers).map((offer) => (`
                          <input class="point__offers-input visually-hidden" 
                                 type="checkbox" 
                                 id="${offer.label.split(` `).join(`-`).toLocaleLowerCase()}" 
                                 name="offer" 
                                 value="${offer.cost}" ${offer.checked ? `checked` : ``}
                                  >
                          <label for="${offer.label.split(` `).join(`-`).toLocaleLowerCase()}" class="point__offers-label">
                            <span class="point__offer-service">${offer.label}</span> + €<span class="point__offer-price">${offer.cost}</span>
                          </label>
                         `.trim()))).join(``)}
                  </div>
          
                </section>
                <section class="point__destination">
                  <h3 class="point__details-title">Destination</h3>
                  <p class="point__destination-text">
                    ${this._description}
                  </p>
                  <div class="point__destination-images">
                    <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
                    <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
                    <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
                    <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
                    <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
                  </div>
                </section>
                <input type="hidden" class="point__total-price" name="total-price" value="">
              </section>
            </form>
          </article>`;
  }
}

export default PointEdit;
