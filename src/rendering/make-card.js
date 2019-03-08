export default (data) => {
  return `<article class="trip-point">
    <i class="trip-icon">${data.icon}</i>
  <h3 class="trip-point__title">${data.title} ${data.city}</h3>
  <p class="trip-point__schedule">
    <span class="trip-point__timetable">${data.time.hour}:${data.time.minute}&nbsp;&mdash; ${data.time.hour + 1}:00</span>
  <span class="trip-point__duration">${data.time.hour + 1 - data.time.hour}h ${data.time.minute}m</span>
  </p>
  <p class="trip-point__price">${data.price}</p>
  <ul class="trip-point__offers">
    ${data.offers}
  </ul>
  </article>`;
};
