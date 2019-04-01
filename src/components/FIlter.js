import component from '../components/EventComponent';

class Filter extends component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.checked;
    this._isDisabled = data.disabled;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }
  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick() {
    return typeof this._onFilter === `function` && this._onFilter();
  }

  get template() {
    return `<span class="filter-wrap">
  <input type="radio" class="trip-filter__input" id="filter-${this._name.toLowerCase()}" name="filter" value="${this._name.toLowerCase()}" ${this._isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${this._name.toLowerCase()}">${this._name}</label></span>`.trim();
  }

  bind() {
    this._element.querySelector(`.trip-filter__input`)
      .addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`.trip-filter__input`)
      .removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;
