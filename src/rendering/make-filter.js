export default (id, checked = false, disabled = false) => {
  const input = `<input type="radio" id="filter-${id}" ${disabled ? `disabled` : ``} value="${id}" name="filter" ${checked ? `checked` : ``}/>`;
  const label = `<label for="filter-${id}" class="trip-filter__item">${id}</label>`;
  return `${input} ${label}`;
};
