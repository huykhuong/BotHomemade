import { AudioPlayerStatus } from "@discordjs/voice";
import { Message } from "discord.js";
import { isEmpty } from "lodash/fp";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../../StateManager";
import { MusicCommand, Song } from "../../types";
import {
  getQuery,
  sendMessageMusicToChannel,
  sendMessageToChannel,
} from "../../utilities/commands";
import {
  generateAudioStream,
  playSong,
} from "../../utilities/commands/musicCommands";
import { generateAutoplayTrack } from "../../utilities/spotify/autoplay";
import { getRequesterName } from "../../utilities/users";
import responseSamples from "../randomResponseCollection.json";
import { checkInVoiceChannel, createVoiceConnection } from "../utils";

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
      sendMessageToChannel(
        message,
        "Play a song",
        "Sorry! I cannot find the requested song."
      );

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
        sendMessageMusicToChannel(message, song, true);
      }

      //Play song immediately if only 1 song in queue
      if (BotHomemadeMusicStateManager.songsQueue.length === 1) {
        sendMessageMusicToChannel(
          message,
          BotHomemadeMusicStateManager.songsQueue[0]
        );

        audioPlayer.play(generateAudioStream(resultInfo.url));
      }

      // Must clear all listeners for every play command call
      audioPlayer.removeAllListeners();

      audioPlayer.on(AudioPlayerStatus.Idle, async () => {
        rootSong = BotHomemadeMusicStateManager.songsQueue.shift() as Song;

        // Continue to play next song normally
        if (BotHomemadeMusicStateManager.songsQueue.length !== 0) {
          sendMessageMusicToChannel(
            message,
            BotHomemadeMusicStateManager.songsQueue[0]
          );

          audioPlayer.play(generateAudioStream(resultInfo.url));
        }

        // If song queue is empty and autoplay is not turned on
        if (
          isEmpty(BotHomemadeMusicStateManager.songsQueue) &&
          !BotHomemadeMusicStateManager.autoplay
        ) {
          sendMessageToChannel(
            message,
            "Songs queue",
            "No more song left in the queue"
          );

          audioPlayer.removeAllListeners();
        } else if (
          isEmpty(BotHomemadeMusicStateManager.songsQueue) &&
          BotHomemadeMusicStateManager.autoplay
        ) {
          const track = await generateAutoplayTrack(rootSong as Song, message);

          if (!track) return;

          BotHomemadeMusicStateManager.songsQueue.push(track);

          // Announce what song is playing
          sendMessageMusicToChannel(
            message,
            BotHomemadeMusicStateManager.songsQueue[0]
          );

          playSong(BotHomemadeMusicStateManager.songsQueue[0].url);
        }
      });
    } else {
      sendMessageToChannel(message, "Oops! Bad news", "No song was found!");
    }
  },
};
