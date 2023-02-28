import { GeneralCommand } from "@types";
import { sendMessageToChannel } from "@utilities/commands";
import {
  getMatchStatus,
  insertVSWord,
} from "@utilities/commands/lolScheduleCommands";
import { colors } from "@variables";
import { Message } from "discord.js";

import lolSchedule from "./lplSchedule.json";

type days = keyof typeof lolSchedule;

export const lplCommand: GeneralCommand = {
  type: "general",
  name: "lpl",
  run: async (message: Message) => {
    const today = new Date();
    const todayUTCTimestamp = new Date(today.toUTCString()).getTime();

    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const monthAndDay = `${month}-${day}` as days;

    if (!lolSchedule[monthAndDay]) {
      sendMessageToChannel(message, "We don't have LPL today", "");
      return;
    }

    const { match: match1, time: time1 } = lolSchedule[monthAndDay]["1"];
    const { match: match2, time: time2 } = lolSchedule[monthAndDay]["2"];

    // Date of match
    const dateOfMatch1 = new Date("2023-".concat(`${monthAndDay} ${time1}`));

    const dateOfMatch2 = new Date("2023-".concat(`${monthAndDay} ${time2}`));

    // Time of match
    const timeOfMatch1 = new Date(dateOfMatch1.toUTCString()).getTime();
    const timeOfMatch2 = new Date(dateOfMatch2.toUTCString()).getTime();

    message.channel.send({
      embeds: [
        {
          title: `LPL Schedule ${monthAndDay}`,
          description: `1. ${insertVSWord(match1)} · ${getMatchStatus(
            timeOfMatch1,
            todayUTCTimestamp
          )}  \n\n 2. ${insertVSWord(match2)} · ${getMatchStatus(
            timeOfMatch2,
            todayUTCTimestamp
          )} ${renderThirdMatch(
            //@ts-ignore
            lolSchedule[monthAndDay]["3"],
            monthAndDay,
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
              label: `Watch now on LPL Youtube`,
              url: `https://www.youtube.com/@LPLOfficial`,
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
              label: `Watch now on LPL Twitch`,
              url: `https://www.twitch.tv/lpl`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
    });
  },
};

const renderThirdMatch = (
  thirdMatch: { match: string; time: string } | undefined,
  monthAndDay: string | days,
  todayUTCTimestamp: number
): string => {
  if (!thirdMatch) return "";

  const match3Data = thirdMatch;
  const { match, time } = match3Data;

  const date = new Date("2023-".concat(`${monthAndDay} ${time}`));

  // Time of match
  const timeOfMatch = new Date(date.toUTCString()).getTime();

  return `\n\n 3. ${insertVSWord(match)} · ${getMatchStatus(
    timeOfMatch,
    todayUTCTimestamp
  )}`;
};
