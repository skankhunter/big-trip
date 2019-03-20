import {getRandomElement} from "./helpers";

export const createPointData = (count, data) => {
  const newPoints = [];
  for (let i = 0; i <= count; i++) {
    let tempData = data.getEvent();
    newPoints.push({
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
