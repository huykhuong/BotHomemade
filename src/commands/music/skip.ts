import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../../StateManager";
import { MusicCommand } from "../../types";
import { sendMessageToChannel } from "../../utilities/commands";
import { getRequesterName } from "../../utilities/users";
import responseSamples from "../randomResponseCollection.json";
import { checkInVoiceChannel } from "../utils";

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
        sendMessageToChannel(
          message,
          "Song queue",
          "The queue is currently empty"
        );

        return;
      } else if (BotHomemadeMusicStateManager.songsQueue.length === 1) {
        sendMessageToChannel(
          message,
          "Song queue",
          "There is no more song left in the queue to be skipped to"
        );

        return;
      } else {
        sendMessageToChannel(
          message,
          "Song queue",
          `${getRequesterName(message.author.id)} skips to \`${
            BotHomemadeMusicStateManager.songsQueue[1].title
          }\``
        );

        audioPlayer.stop();
      }
    }
    // If autoplay is on, just stop the audio and let the listener handle what happen next
    else {
      audioPlayer.stop();
    }
  },
};
