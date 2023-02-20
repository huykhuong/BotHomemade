import { APIEmbed, Message } from "discord.js";
import isEmpty from "lodash/isEmpty";

import responseSamples from "./randomResponseCollection.json";
import {
  checkInVoiceChannel,
  checkIsPlayingMusicOrInVoiceChannel,
  sendRandomCommandResponse,
} from "./utils";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand } from "../types";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const removeCommand: MusicCommand = {
  type: "music",
  name: "remove",
  run: async (message: Message) => {
    const commandAndBody = message.content.split(" ");
    const queuePositionToBeRemoved = Number(commandAndBody[1]);

    // Extracting response samples
    const { notInARoom, notInSameRoom } = responseSamples.skipCommand;

    const { voiceConnection } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, notInARoom)) return;

    if (!checkIsPlayingMusicOrInVoiceChannel(message, voiceConnection)) return;

    // Check if the user is in the same voice channel as the bot
    if (
      message.member?.voice.channel?.id !== BotHomemadeGeneralState.channelId
    ) {
      message.channel.send(sendRandomCommandResponse(notInSameRoom));
      return;
    }

    if (commandAndBody.length <= 1) {
      message.channel.send({
        embeds: messageBuilder(
          "Hmm, no queue position provided to be removed!"
        ),
      });
      return;
    }

    // Check if the queue position is not a number
    if (isNaN(queuePositionToBeRemoved)) {
      message.channel.send({
        embeds: messageBuilder("Bruh! Provide a number, not a text"),
      });
      return;
    }

    // Check if the queue position is the song that is playing
    if (queuePositionToBeRemoved === 1) {
      message.channel.send({
        embeds: messageBuilder(
          "Am singing this song, have some respect man 😠"
        ),
      });
      return;
    }

    // Check if the queue is empty
    if (isEmpty(BotHomemadeMusicStateManager.songsQueue)) {
      message.channel.send({
        embeds: messageBuilder("The queue is empty"),
      });
      return;
    }

    // Check if the queue position is out of boundary of song queue
    if (
      queuePositionToBeRemoved >
        BotHomemadeMusicStateManager.songsQueue.length ||
      queuePositionToBeRemoved < 1
    ) {
      message.channel.send({
        embeds: messageBuilder("Can't find this song in the queue to remove"),
      });
      return;
    }

    // ------------------------------------------

    // Get on with the actual removal of the song
    const songName =
      BotHomemadeMusicStateManager.songsQueue[queuePositionToBeRemoved - 1]
        .title;
    BotHomemadeMusicStateManager.songsQueue.splice(
      queuePositionToBeRemoved - 1,
      1
    );

    message.channel.send({
      embeds: messageBuilder(
        `${getRequesterName(
          message.author.id
        )} removed \`${songName}\` from the queue`
      ),
    });
  },
};

function messageBuilder(description: string): APIEmbed[] {
  return [
    {
      title: "Remove song",
      description,
      color: colors.embedColor,
    },
  ];
}
