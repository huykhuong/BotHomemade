import { AudioPlayerStatus } from "@discordjs/voice";
import { APIEmbed, Message } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import { BotHomemadeMusicState, MusicCommand, Song } from "../types";
import { getQuery } from "../utilities/commands";
import { generateAudioStream } from "../utilities/commands/musicCommands";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

export const playCommand: MusicCommand = {
  type: "music",
  name: "play",
  run: async (
    message: Message,
    botHomemadeMusicState: BotHomemadeMusicState
  ) => {
    // Extracting fields from state manager
    const {
      audioPlayer: player,
      songsQueue: queue,
      voiceConnection,
    } = botHomemadeMusicState;

    checkInVoiceChannel(
      player,
      message,
      responseSamples.joinCommand.failed,
      voiceConnection
    );

    const searchResults = await ytsr(getQuery(message.content), { limit: 1 });
    const resultInfo = searchResults.items[0] as Video;

    // Check to see if the youtube link has result
    if (ytdl.validateURL(resultInfo.url)) {
      const song: Song = {
        url: resultInfo.url,
        title: resultInfo.title,
        author: resultInfo.author?.name || "",
        thumbnail: resultInfo.bestThumbnail?.url || "",
        duration: resultInfo.duration || "",
      };

      queue.push(song);

      if (queue.length > 1) {
        message.channel.send({
          embeds: [
            {
              title: `Added ${resultInfo.title} to the queue`,
              description: `Author: ${song.author} | Duration: ${song.duration}`,
              url: song.url,
              fields: [
                {
                  name: `Requester: ${getRequesterName(message.author.id)}`,
                  value: "",
                },
              ],
              image: { url: song.thumbnail },
              color: colors.embedColor,
            },
          ],
        });
      }

      //Play song immediately if only 1 song in queue
      if (queue.length === 1) {
        message.channel.send({
          embeds: playingSongEmbedBuilder(
            queue[0],
            getRequesterName(message.author.id)
          ),
        });

        player.play(generateAudioStream(resultInfo.url));
      }

      // Must clear all listeners for every play command call
      player.removeAllListeners();

      player.on(AudioPlayerStatus.Idle, () => {
        queue.shift();

        if (queue.length !== 0) {
          message.channel.send({
            embeds: playingSongEmbedBuilder(
              queue[0],
              getRequesterName(message.author.id)
            ),
          });

          player.play(generateAudioStream(resultInfo.url));
        }

        if (queue.length === 0) {
          message.channel.send({
            embeds: [
              {
                title: "Songs queue",
                description: "No more song left in the queue",
                color: colors.embedColor,
              },
            ],
          });
        }
      });
    } else {
      message.channel.send({
        embeds: [
          {
            title: "No song was found!",
            color: colors.embedColor,
          },
        ],
      });
    }
  },
};

function playingSongEmbedBuilder(song: Song, requester: string): APIEmbed[] {
  return [
    {
      title: `Playing ${song.title}`,
      description: `Author: ${song.author} | Duration: ${song.duration}`,
      url: song.url,
      fields: [{ name: `Requester: ${requester}`, value: "" }],
      image: { url: song.thumbnail },
      color: colors.embedColor,
    },
  ];
}
