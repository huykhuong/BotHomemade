import { AudioPlayerStatus } from "@discordjs/voice";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import { MusicCommand } from "../types";
import { generateAudioStream } from "../utilities/commands/musicCommands";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const skipCommand: MusicCommand = {
  type: "music",
  name: "skip",
  run: async (message, botHomemadeMusicState, BotHomemadeGeneralState) => {
    // Extracting fields from state manager
    const { songsQueue } = botHomemadeMusicState;
    const { audioPlayer } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

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
      message.channel.send({
        embeds: [
          {
            title: "Song queue",
            description: `${getRequesterName(message.author.id)} skips to \`${
              songsQueue[1].title
            }\``,
            color: colors.embedColor,
          },
        ],
      });

      audioPlayer.stop();

      // Must clear all listeners for every skip command call
      audioPlayer.removeAllListeners();

      audioPlayer.on(AudioPlayerStatus.Idle, () => {
        songsQueue.shift();

        if (songsQueue.length !== 0) {
          message.channel.send({
            embeds: [
              {
                title: `Playing ${songsQueue[0].title}`,
                description: `Author: ${songsQueue[0].author} | Duration: ${songsQueue[0].duration}`,
                url: songsQueue[0].url,
                fields: [
                  {
                    name: `Requester: ${songsQueue[0].requester}`,
                    value: "",
                  },
                ],
                image: { url: songsQueue[0].thumbnail },
                color: colors.embedColor,
              },
            ],
          });

          audioPlayer.play(generateAudioStream(songsQueue[0].url));
        }

        // This check is used for announcing no song left in the queue, when playing music using Idle event listener
        if (songsQueue.length === 0) {
          message.channel.send({
            embeds: [
              {
                title: "Songs queue",
                description: "No more song left in the queue",
                color: colors.embedColor,
              },
            ],
          });

          audioPlayer.removeAllListeners();
        }
      });
    }
  },
};
