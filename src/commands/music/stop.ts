import { Message } from "discord.js";

import { BotHomemadeGeneralState } from "../../StateManager";
import { MusicCommand } from "../../types";
import { sendMessageToChannel } from "../../utilities/commands";
import { getRequesterName } from "../../utilities/users";
import responseSamples from "../randomResponseCollection.json";
import { checkInVoiceChannel, sendRandomCommandResponse } from "../utils";

const stopCommand: MusicCommand = {
  type: "music",
  name: "stop",
  run: async (message: Message) => {
    if (
      !checkInVoiceChannel(message, responseSamples.stopSongCommand.notInARoom)
    )
      return;

    if (BotHomemadeGeneralState.audioPlayer.state.status === "playing") {
      BotHomemadeGeneralState.audioPlayer.removeAllListeners();
      BotHomemadeGeneralState.audioPlayer.stop();
      sendMessageToChannel(
        message,
        "Music stopped!",
        `${getRequesterName(message.author.id)} stops playing music`
      );
    } else {
      sendMessageToChannel(
        message,
        "I'm not singing!",
        sendRandomCommandResponse(responseSamples.stopSongCommand.notSinging)
      );
    }
  },
};

export default stopCommand;
