import { Message } from "discord.js";

import { BotHomemadeMusicState, MusicCommand } from "../types";
import { generateAudioStream } from "../utilities/commands/musicCommands";
import { colors } from "../variables";

export const skipCommand: MusicCommand = {
  type: "music",
  name: "skip",
  run: async (
    message: Message,
    botHomemadeMusicState: BotHomemadeMusicState
  ) => {
    // Extracting fields from state manager
    const { audioPlayer, songsQueue } = botHomemadeMusicState;

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
      return;
    } else if (songsQueue.length === 1) {
      message.channel.send({
        embeds: [
          {
            title: "Song queue",
            description:
              "There is no more song left in the queue to be skipped to",
            color: colors.embedColor,
          },
        ],
      });
      return;
    } else {
      audioPlayer.stop();
      songsQueue.shift();

      audioPlayer.play(generateAudioStream(songsQueue[0].url));
    }
  },
};
