export const getMatchStatus = (
  timeOfMatch: number,
  timeNowToday: number
): string => {
  if (
    (Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) >= -150 &&
      Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) < 0) ||
    Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) === 0
  ) {
    return "Live now 🔴";
  } else if (Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) < -150) {
    return "Match concluded";
  }

  return `Live in ${formatTime(timeOfMatch - timeNowToday)}`;
};

export const insertVSWord = (matchName: string): string => {
  const match = matchName.split(" ");

  match.splice(1, 0, "vs");

  return match.join(" ");
};

export const formatTime = (miliseconds: number): string => {
  const minutes = miliseconds / 1000 / 60;

  const hours = minutes / 60;

  const roundedDownHours = Math.floor(hours);

  const leftoverMinutes = Math.round((hours - roundedDownHours) * 60);

  if (roundedDownHours <= 1 && leftoverMinutes <= 1) {
    return `${roundedDownHours} hour and ${leftoverMinutes} minute`;
  } else if (roundedDownHours <= 1 && leftoverMinutes > 1) {
    return `${roundedDownHours} hour and ${leftoverMinutes} minutes`;
  } else if (roundedDownHours > 1 && leftoverMinutes <= 1) {
    return `${roundedDownHours} hours and ${leftoverMinutes} minute`;
  }

  return `${roundedDownHours} hours and ${leftoverMinutes} minutes`;
};
