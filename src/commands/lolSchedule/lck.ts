import { Message } from "discord.js";

import lolSchedule from "./lolSchedule.json";

import { GeneralCommand } from "../../types";
import { colors } from "../../variables";

type days = keyof typeof lolSchedule.LCK;

export const lckCommand: GeneralCommand = {
  type: "general",
  name: "lck",
  run: async (message: Message) => {
    const today = new Date();
    const todayUTCTimestamp = new Date(today.toUTCString()).getTime();

    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const monthAndDay = `${month}-${day}` as days;

    const { match: match1, time: time1 } = lolSchedule.LCK[monthAndDay]["1"];
    const { match: match2, time: time2 } = lolSchedule.LCK[monthAndDay]["2"];

    // Date of match
    const dateOfMatch1 = new Date("2023-".concat(`${monthAndDay} ${time1}`));

    const dateOfMatch2 = new Date("2023-".concat(`${monthAndDay} ${time2}`));

    // Time of match
    const timeOfMatch1 = new Date(dateOfMatch1.toUTCString()).getTime();
    const timeOfMatch2 = new Date(dateOfMatch2.toUTCString()).getTime();

    message.channel.send({
      embeds: [
        {
          title: `LCK Schedule ${monthAndDay}`,
          description: `1. ${insertVSWord(match1)} · ${getMatchStatus(
            timeOfMatch1,
            todayUTCTimestamp
          )}  \n\n 2. ${insertVSWord(match2)} · ${getMatchStatus(
            timeOfMatch2,
            todayUTCTimestamp
          )}`,
          color: colors.embedColor,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: `Watch now on LCK Tieng Viet`,
              url: `https://www.youtube.com/@LCKglobal`,
              disabled: false,
              type: 2,
            },
            {
              style: 5,
              label: `Watch now on Ceadrel Stream`,
              url: `https://www.twitch.tv/caedrel`,
              disabled: false,
              type: 2,
            },
            {
              style: 5,
              label: `Watch now on LCK Global Youtube`,
              url: `https://www.youtube.com/@LCKglobal`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
    });
  },
};

const getMatchStatus = (timeOfMatch: number, timeNowToday: number): string => {
  if (
    Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) >= -150 ||
    Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) === 0
  ) {
    return "Live now 🔴";
  } else if (Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60) < -150) {
    return "Match concluded";
  }

  return `Live in ${Math.floor(
    Math.ceil((timeOfMatch - timeNowToday) / 1000 / 60)
  )}`;
};

const insertVSWord = (matchName: string): string => {
  const match = matchName.split(" ");

  match.splice(1, 0, "vs");

  return match.join(" ");
};
