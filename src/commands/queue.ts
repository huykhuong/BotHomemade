import { Message } from "discord.js";

import { BotHomemadeMusicState, MusicCommand } from "../types";
import { colors } from "../variables";

export const queueCommand: MusicCommand = {
  type: "music",
  name: "queue",
  run: async (
    message: Message,
    botHomemadeMusicState: BotHomemadeMusicState
  ) => {
    const { songsQueue } = botHomemadeMusicState;

    if (songsQueue.length === 0) {
      message.channel.send({
        embeds: [
          {
            title: "Song queue",
            description: "The queue is currently empty",
            color: colors.embedColor,
          },
        ],
      });
    } else {
      message.channel.send({
        embeds: [
          {
            title: "Song queue",
            fields: songsQueue.map((song, index) => {
              // Playing song
              if (index === 0) {
                return {
                  name: `${index + 1}: ${song.title} - Playing`,
                  value: "",
                };
                // Other songs
              } else {
                return { name: `${index + 1}: ${song.title}`, value: "" };
              }
            }),
            color: colors.embedColor,
          },
        ],
      });
    }
  },
};
