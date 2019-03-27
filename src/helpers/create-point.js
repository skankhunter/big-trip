import {getRandomElement} from "./helpers";

export const createPointData = (count, data) => {
  function generateToken(length) {
    // edit the token allowed characters
    const a = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`.split(``);
    const b = [];
    for (let i = 0; i < length; i++) {
      let j = (Math.random() * (a.length - 1)).toFixed(0);
      b[i] = a[j];
    }
    return b.join(``);
  }

  const newPoints = [];
  for (let i = 0; i <= count; i++) {
    let tempData = data.getEvent();
    newPoints.push({
      token: generateToken(32),
      city: getRandomElement(data.city),
      title: tempData.title,
      picture: data.picture,
      price: data.price,
      offers: tempData.offer,
      offerPrice: data.offerPrice,
      icon: tempData.icon,
      description: data.description,
      date: data.dueData,
      time: data.time,
      icons: data.iconPoint,
      offersList: data.offers
    });
  }
  return newPoints;
};
