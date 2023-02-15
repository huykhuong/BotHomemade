import { Message } from "discord.js";
import { isEmpty } from "lodash/fp";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel, sendRandomCommandResponse } from "./utils";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand } from "../types";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const pauseCommand: MusicCommand = {
  type: "music",
  name: "pause",
  run: async (message: Message<boolean>) => {
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

      message.channel.send({
        embeds: [
          {
            title: "Song paused!",
            description: `${getRequesterName(
              message.author.id
            )} pauses the song`,
            color: colors.embedColor,
          },
        ],
      });

      return;
    }

    message.channel.send("Bitch, I'm paused already");
  },
};
