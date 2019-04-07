const getRandomNum = (count) => {
  return Math.floor(Math.random() * count);
};

const getRandomElement = (array) => {
  return array[getRandomNum(array.length)];
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const getTime = (date, dateDue) => {
  const diffMs = dateDue - date;
  const diffHrs = Math.floor(diffMs / 3600000);
  // const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0` + hours;
  }
  if (minutes < 10) {
    minutes += `0`;
  }

  let dueHours = dateDue.getHours();
  let dueMinutes = dateDue.getMinutes();
  if (dueHours < 10) {
    dueHours = `0` + dueHours;
  }
  if (dueMinutes < 10) {
    dueMinutes += `0`;
  }

  return {
    from: hours + `:` + minutes,
    due: dueHours + `:` + dueMinutes,
    duration: diffHrs + `H ` + diffMins
  };
};

const types = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳️`,
  // 'Transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛`,
  // 'Restaurant': `🍴`,
};
export {getRandomElement, getRandomNum, shuffleArray, getTime, types};
