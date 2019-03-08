import {getRandomElement} from "./helpers";

export const createPointData = (count, data) => {
  const newPoints = [];
  for (let i = 0; i <= count; i++) {
    let tempData = data.getEvent();
    newPoints.push({
      city: getRandomElement(data.city),
      title: tempData.title,
      picture: data.picture,
      event: tempData.event,
      price: data.price,
      offers: data.offer,
      icon: tempData.icon,
      description: data.description,
      date: data.dueData,
      time: data.time
    });
  }
  return newPoints;
};
