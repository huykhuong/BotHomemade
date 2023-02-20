import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand } from "../types";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const skipCommand: MusicCommand = {
  type: "music",
  name: "skip",
  run: async (message) => {
    // Extracting fields from state manager
    const { audioPlayer } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    // If Autoplay is not on, workflow is normal
    if (!BotHomemadeMusicStateManager.autoplay) {
      if (BotHomemadeMusicStateManager.songsQueue.length === 0) {
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
      } else if (BotHomemadeMusicStateManager.songsQueue.length === 1) {
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
                BotHomemadeMusicStateManager.songsQueue[1].title
              }\``,
              color: colors.embedColor,
            },
          ],
        });

        audioPlayer.stop();
      }
    }
    // If autoplay is on, just stop the audio and let the listener handle what happen next
    else {
      audioPlayer.stop();
    }
  },
};
