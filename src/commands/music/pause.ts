import { Message } from "discord.js";
import { isEmpty } from "lodash/fp";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../../StateManager";
import { MusicCommand } from "../../types";
import { sendMessageToChannel } from "../../utilities/commands";
import { getRequesterName } from "../../utilities/users";
import responseSamples from "../randomResponseCollection.json";
import { checkInVoiceChannel, sendRandomCommandResponse } from "../utils";

const pauseCommand: MusicCommand = {
  type: "music",
  name: "pause",
  run: async (message: Message) => {
    if (!checkInVoiceChannel(message, responseSamples.pauseCommand.notInARoom))
      return;

    const { audioPlayer } = BotHomemadeGeneralState;
    const { paused, songsQueue } = BotHomemadeMusicStateManager;

    if (isEmpty(songsQueue)) {
      message.channel.send(
        `${sendRandomCommandResponse(responseSamples.pauseCommand.notSinging)}`
      );
      return;
    }

    if (!paused) {
      audioPlayer.pause();
      BotHomemadeMusicStateManager.paused = true;

      sendMessageToChannel(
        message,
        "Song paused!",
        `${getRequesterName(message.author.id)} pauses the song`
      );

      return;
    }

    message.channel.send("Bitch, I'm paused already");
  },
};

export default pauseCommand;
