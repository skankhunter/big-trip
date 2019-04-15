import EventComponent from "../components/EventComponent";
import {createElement} from "../helpers/create-element";
import flatpickr from 'flatpickr';
import {getTime, getDuration, types} from "../helpers/helpers";

class PointEdit extends EventComponent {
  constructor(data) {
    super();
    this._id = data.id;
    this._city = data.city;
    this._title = data.title;
    this._picture = data.picture;
    this._type = data.type;
    this._price = data.price;
    this._offers = data.offers;
    this._typeIcon = data.typeIcon;
    this._description = data.description;
    this._date = data.dueData;
    this._time = data.time;
    this._duration = getDuration(this._date, this._dateDue);
    this._startPrice = data.price;

    this._isFavorite = false;
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
    this._onChangeDestination = this._onChangeDestination.bind(this);
  }

  static setDestinations(data) {
    this._destinations = data;
  }

  static setAllOffers(data) {
    this._allOffersData = data;
  }

  _processForm(formData) {
    const entry = {
      city: ``,
      type: ``,
      time: this._time,
      price: ``,
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    entry.type = this._type.toLowerCase();
    entry.typeIcon = types[entry.type];
    entry.description = this._description;
    entry.offers = this._offers;
    entry.picture = this._picture;
    entry.isFavorite = this._isFavorite;
    entry.date = this._date;
    // entry.dateDue = this._dateDue;

    return entry;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onKeyDown(e) {
    const ESC = 27;
    if (e.keyCode === ESC) {
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
      this._onDelete({id: this._id});
    }
  }

  _onCheckedChange(e) {
    for (let offer of this._offers) {
      if (e.target.id === offer.title.split(` `).join(`-`).toLocaleLowerCase()) {
        offer.accepted = e.currentTarget.checked;
      }
    }
  }

  _onFavoriteChange() {
    this._isFavorite = !this._isFavorite;
  }

  _onEventChange(e) {
    let typeName = e.target.value;

    this._type = typeName;
    this._typeIcon = types[typeName];
    for (const offer of this._offers) {
      if (offer.accepted) {
        this._price -= offer.price;
      }
    }

    PointEdit._allOffersData.forEach((offersByType) => {
      if (offersByType.type === typeName) {
        this._offers = this._convertOffers(offersByType.offers);
      }
    });

    this._partialUpdate();
    this.bind();
  }

  _convertOffers(offers) {
    return offers.map((offer) => {
      return {
        title: offer.name,
        price: offer.price,
      };
    });
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

  _onChangeDestination() {
    const destInput = this._element.querySelector(`.point__destination-input`);
    let newDestination;
    if (PointEdit._destinations.some((destination) => destInput.value === destination.name)) {
      PointEdit._destinations.forEach((destination) => {
        if (destination.name === destInput.value) {
          newDestination = destination;
        }
      });
      this._city = newDestination.name;
      this._description = newDestination.description;
      this._picture = newDestination.pictures;
      this._partialUpdate();
    }
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
    const dateStart = this.element.querySelector(`input[name="date-start"]`);
    const dateEnd = this.element.querySelector(`input[name="date-end"]`);

    this._element.addEventListener(`submit`, this._onSubmitButtonClick);

    document.addEventListener(`keydown`, this._onKeyDown);

    this._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onFavoriteChange);

    this._element.querySelector(`form`).addEventListener(`reset`, this._onFormDelete);

    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onChangeDestination);

    flatpickr(dateStart, {
      'defaultDate': [this._date],
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `H:i`,
      'onChange': (selectedDates) => {
        this._date = selectedDates[0];
        if (this._date && this._dateDue) {
          this._time = getTime(this._date, this._dateDue);
        }
      },
    });

    flatpickr(dateEnd, {
      'defaultDate': [this._dateDue],
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `H:i`,
      'onChange': (selectedDates) => {
        this._dateDue = selectedDates[0];
        if (this._date && this._dateDue) {
          this._time = getTime(this._date, this._dateDue);
        }
      },
    });

    this._createCycleListeners();
  }

  unbind() {
    this._element.removeEventListener(`submit`, this._onSubmitButtonClick);

    document.removeEventListener(`keydown`, this._onKeyDown);

    this._element.querySelector(`form`).removeEventListener(`reset`, this._onFormDelete);

    this._element.querySelector(`.point__destination-input`)
      .removeEventListener(`change`, this._onChangeDestination);

    this._removeCycleListeners();
  }

  update(data) {
    this._city = data.city;
    this._type = data.type;
    this._typeIcon = data.typeIcon;
    this._description = data.description;
    this._price = data.price;
    this._picture = data.picture;
    this._offers = data.offers;
    this._time = data.time;
    this._date = data.date;
    this._dateDue = data.dateDue;
    this._isFavorite = data.isFavorite;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
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
                <label class="travel-way__label" for="travel-way__toggle">${this._typeIcon}</label>
        
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
                    
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travel-way" value="ship">
                    <label class="travel-way__select-label" for="travel-way-ship">🛳 ship</label>
  
                    <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travel-way" value="drive">
                    <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
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
                <label class="point__destination-label" for="destination"><span class="point__destination-type">${this._type}</span> to</label>
                <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
                <datalist id="destination-select">
                   ${PointEdit._destinations.map((dest) =>`<option value="${dest.name}"></option>`).join(``).trim()}
                  </datalist>
                </div>
          
                <div class="point__time">
                  choose time
                  <input class="point__input" type="text" value="${this._time.from}" name="date-start" placeholder="19:00">
                  <input class="point__input" type="text" value="${this._time.due}" name="date-end" placeholder="21:00">
                </div>
          
                <label class="point__price">
                  write price
                  <span class="point__price-currency">€</span>
                  <input class="point__input" type="text" value="${this._price}" name="price" readonly>
              </label>
        
              <div class="point__buttons">
                <button class="point__button point__button--save" type="submit">Save</button>
                <button class="point__button point__button--delete" type="reset">Delete</button>
              </div>
        
              <div class="paint__favorite-wrap">
                <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
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
                                 id="${offer.title.split(` `).join(`-`).toLocaleLowerCase()}" 
                                 name="offer" 
                                 value="${offer.price}" ${offer.accepted ? `checked` : ``}
                                  >
                          <label for="${offer.title.split(` `).join(`-`).toLocaleLowerCase()}" class="point__offers-label">
                            <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
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
                    <${this._picture.map((pic) =>` <img src="${pic.src}" alt="${pic.description}" class="point__destination-image">`).join(``).trim()}
                    </div>
                  </section>
                  <input type="hidden" class="point__total-price" name="total-price" value="">
                </section>
              </form>
            </article>`;
  }
}

export default PointEdit;
