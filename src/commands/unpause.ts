import { Message } from "discord.js";
import { isEmpty } from "lodash";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel, sendRandomCommandResponse } from "./utils";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand } from "../types";
import { sendMessageToChannel } from "../utilities/commands";
import { getRequesterName } from "../utilities/users";

export const unpauseCommand: MusicCommand = {
  type: "music",
  name: "unpause",
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

    if (paused) {
      audioPlayer.unpause();
      BotHomemadeMusicStateManager.paused = false;
      sendMessageToChannel(
        message,
        "Unpaused",
        `${getRequesterName(message.author.id)} unpauses`
      );

      return;
    }

    message.channel.send("Bitch, I'm unpaused already");
  },
};
