import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import { BotHomemadeMusicStateManager } from "../StateManager";
import { MusicCommand } from "../types";
import { playSong } from "../utilities/commands/musicCommands";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const skipCommand: MusicCommand = {
  type: "music",
  name: "skip",
  run: async (message, botHomemadeMusicState, BotHomemadeGeneralState) => {
    // Extracting fields from state manager

    const { audioPlayer } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    if (
      !BotHomemadeMusicStateManager.autoplay ||
      (BotHomemadeMusicStateManager.autoplay &&
        botHomemadeMusicState.songsQueue.length > 1)
    ) {
      if (botHomemadeMusicState.songsQueue.length === 0) {
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
      } else if (botHomemadeMusicState.songsQueue.length === 1) {
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
        message.channel.send({
          embeds: [
            {
              title: "Song queue",
              description: `${getRequesterName(message.author.id)} skips to \`${
                botHomemadeMusicState.songsQueue[1].title
              }\``,
              color: colors.embedColor,
            },
          ],
        });

        audioPlayer.stop();

        botHomemadeMusicState.songsQueue.shift();

        playSong(botHomemadeMusicState.songsQueue[0].url);
      }
    } else if (
      BotHomemadeMusicStateManager.autoplay &&
      botHomemadeMusicState.songsQueue.length === 1
    ) {
      audioPlayer.stop();
    } else if (
      BotHomemadeMusicStateManager.autoplay &&
      botHomemadeMusicState.songsQueue.length === 0
    ) {
      audioPlayer.stop();
    }
  },
};
