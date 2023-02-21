import { AudioPlayerStatus } from "@discordjs/voice";
import { APIEmbed, Message } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel, createVoiceConnection } from "./utils";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand, Song } from "../types";
import { getQuery } from "../utilities/commands";
import {
  generateAudioStream,
  playSong,
} from "../utilities/commands/musicCommands";
import { generateAutoplayTrack } from "../utilities/spotify/autoplay";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

let rootSong = {} as Song;

export const playCommand: MusicCommand = {
  type: "music",
  name: "play",
  run: async (message: Message) => {
    // Extracting fields from state manager
    const { voiceConnection, audioPlayer } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed))
      return;

    createVoiceConnection(audioPlayer, voiceConnection, message);

    const searchResults = await ytsr(getQuery(message.content), { limit: 1 });

    // Check if cannot find a song from youtube
    if (!searchResults) {
      message.channel.send({
        embeds: [
          {
            title: "Play a song",
            description: "Sorry! I cannot find the requested song.",
            color: colors.embedColor,
          },
        ],
      });

      return;
    }

    const resultInfo = searchResults.items[0] as Video;

    // Check to see if the youtube link has result
    if (ytdl.validateURL(resultInfo.url)) {
      const song: Song = {
        url: resultInfo.url,
        title: resultInfo.title,
        author: resultInfo.author?.name || "",
        thumbnail: resultInfo.bestThumbnail?.url || "",
        duration: resultInfo.duration || "",
        requester: getRequesterName(message.author.id),
      };

      BotHomemadeMusicStateManager.songsQueue.push(song);

      if (BotHomemadeMusicStateManager.songsQueue.length > 1) {
        message.channel.send({
          embeds: [
            {
              title: `${song.requester} added ${resultInfo.title} to the queue`,
              description: `Author: ${song.author} | Duration: ${song.duration}`,
              url: song.url,
              image: { url: song.thumbnail },
              color: colors.embedColor,
            },
          ],
        });
      }

      //Play song immediately if only 1 song in queue
      if (BotHomemadeMusicStateManager.songsQueue.length === 1) {
        message.channel.send({
          embeds: playingSongEmbedBuilder(
            BotHomemadeMusicStateManager.songsQueue[0]
          ),
        });

        audioPlayer.play(generateAudioStream(resultInfo.url));
      }

      // Must clear all listeners for every play command call
      audioPlayer.removeAllListeners();


      audioPlayer.on(AudioPlayerStatus.Idle, async () => {
        rootSong = BotHomemadeMusicStateManager.songsQueue.shift() as Song;

        // Continue to play next song normally
        if (BotHomemadeMusicStateManager.songsQueue.length !== 0) {
          message.channel.send({
            embeds: playingSongEmbedBuilder(
              BotHomemadeMusicStateManager.songsQueue[0]
            ),
          });

          audioPlayer.play(generateAudioStream(resultInfo.url));
        }

        // If song queue is empty and autoplay is not turned on
        if (
          BotHomemadeMusicStateManager.songsQueue.length === 0 &&
          !BotHomemadeMusicStateManager.autoplay
        ) {

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
        } else if (
          BotHomemadeMusicStateManager.songsQueue.length === 0 &&
          BotHomemadeMusicStateManager.autoplay
        ) {
          const track = await generateAutoplayTrack(rootSong as Song, message);

          if (!track) return;

          BotHomemadeMusicStateManager.songsQueue.push(track);
          playSong(BotHomemadeMusicStateManager.songsQueue[0].url);
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

function playingSongEmbedBuilder(song: Song): APIEmbed[] {
  return [
    {
      title: `Playing ${song.title}`,
      description: `Author: ${song.author} | Duration: ${song.duration}`,
      url: song.url,
      fields: [{ name: `Requester: ${song.requester}`, value: "" }],
      image: { url: song.thumbnail },
      color: colors.embedColor,
    },
  ];
}
