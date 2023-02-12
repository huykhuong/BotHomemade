import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel, createVoiceConnection } from "./utils";

import { GeneralCommand } from "../types";

export const joinCommand: GeneralCommand = {
  type: "general",
  name: "join",
  run: async (message, BotHomemadeGeneralState) => {
    // If requester is not in a voice channel
    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    const { voiceConnection, audioPlayer } = BotHomemadeGeneralState;

    createVoiceConnection(audioPlayer, voiceConnection, message);
  },
};
