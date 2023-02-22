import { Message } from "discord.js";

import { BotHomemadeMusicStateManager } from "../StateManager";
import { MusicCommand } from "../types";
import { sendMessageToChannel } from "../utilities/commands";
import { colors } from "../variables";

export const queueCommand: MusicCommand = {
  type: "music",
  name: "queue",
  run: async (message: Message) => {
    if (BotHomemadeMusicStateManager.songsQueue.length === 0) {
      sendMessageToChannel(
        message,
        "Song queue",
        "The queue is currently empty"
      );
    } else {
      message.channel.send({
        embeds: [
          {
            title: "Song queue",
            fields: BotHomemadeMusicStateManager.songsQueue.map(
              (song, index) => {
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
              }
            ),
            color: colors.embedColor,
          },
        ],
      });
    }
  },
};
