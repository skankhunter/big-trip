export default (data) => {
  return `<article class="trip-point">
    <i class="trip-icon">${data.icon}</i>
  <h3 class="trip-point__title">${data.title} ${data.city}</h3>
  <p class="trip-point__schedule">
    <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
  <span class="trip-point__duration">1h 30m</span>
  </p>
  <p class="trip-point__price">${data.price}</p>
  <ul class="trip-point__offers">
  <li>
    <button class="trip-point__offer">${data.offers[0]}</button>
  </li>
  <li>
    <button class="trip-point__offer">${data.offers[1]}</button>
  </li>
  </ul>
  </article>`;
};
