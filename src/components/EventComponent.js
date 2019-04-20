import {createElement} from "../helpers/create-element";

class EventComponent {
  constructor() {
    if (new.target === EventComponent) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  get element() {
    return this._element;
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  get date() {
    return {
      day: this._day,
      month: this._month,
      uniqueDay: this._uniqueDay,
      time: this._time,
    };
  }

  bind() {}

  unbind() {}

  update() {}
}

export default EventComponent;
