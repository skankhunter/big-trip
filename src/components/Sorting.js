import component from '../components/EventComponent';

class Sorting extends component {
  constructor(data) {
    super();
    this._id = data.id;
    this._name = data.name;
    this._isChecked = data.checked;
    this._onSorting = null;
    this._onSortingClick = this._onSortingClick.bind(this);
  }
  set onSorting(fn) {
    this._onSorting = fn;
  }

  _onSortingClick() {
    this._onSorting();
  }

  get template() {
    return `<span class="sorting-wrap">
    <input type="radio" name="trip-sorting" id="${this._id}" value="${this._name.toLowerCase()}" ${this._isChecked ? `checked` : ``}>
    <label class="trip-sorting__item trip-sorting__item--${this._name.toLowerCase()}" for="sorting-${this._name.toLowerCase()}">${this._name}</label></span>`.trim();
  }

  bind() {
    this._element.querySelector(`.trip-sorting__item`)
      .addEventListener(`click`, this._onSortingClick);
  }

  unbind() {
    this._element.querySelector(`.trip-sorting__item`)
      .removeEventListener(`click`, this._onSortingClick);
  }
}

export default Sorting;
