import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Message } from "discord.js";
import { isEmpty } from "lodash/fp";

import { playingSongEmbedBuilder } from "./play";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../StateManager";
import { MusicCommand, Song } from "../types";
import {
  generateSpotifyAudioStream,
  playSong,
} from "../utilities/commands/musicCommands";
import { generateAutoplayTrack } from "../utilities/spotify/autoplay";
import { getRequesterName } from "../utilities/users";
import { colors } from "../variables";

let rootSong = {} as Song;

const autoplayCommand: MusicCommand = {
  type: "music",
  name: "autoplay",
  run: async (message: Message<boolean>) => {
    const { audioPlayer } = BotHomemadeGeneralState;

    // Checking if no song is existing first
    if (isEmpty(BotHomemadeMusicStateManager.songsQueue)) {
      message.channel.send({
        embeds: [
          {
            title: "Autoplay",
            description:
              "There must be at least one song in the queue before turning on Autoplay!",
            color: colors.embedColor,
          },
        ],
      });
      return;
    }

    BotHomemadeMusicStateManager.autoplay =
      !BotHomemadeMusicStateManager.autoplay;

    audioPlayer.removeAllListeners();

    if (!BotHomemadeMusicStateManager.autoplay) {
      message.channel.send({
        embeds: [
          {
            title: "Autoplay",
            description: `${getRequesterName(
              message.author.id
            )} turns off Autoplay`,
            color: colors.embedColor,
          },
        ],
      });
      return;
    }

    message.channel.send({
      embeds: [
        {
          title: "Autoplay",
          description: `${getRequesterName(
            message.author.id
          )} turns on Autoplay`,
          color: colors.embedColor,
        },
      ],
    });

    audioPlayer.addListener(AudioPlayerStatus.Idle, async () => {
      rootSong = BotHomemadeMusicStateManager.songsQueue.shift() as Song;

      // Audio player is living by autoplay getting song on its own
      if (
        isEmpty(BotHomemadeMusicStateManager.songsQueue) &&
        BotHomemadeMusicStateManager.autoplay
      ) {
        const track = await generateAutoplayTrack(rootSong as Song, message);

        if (!track) return;

        BotHomemadeMusicStateManager.songsQueue.push(track);

        // Announce what song is playing
        message.channel.send({
          embeds: playingSongEmbedBuilder(
            BotHomemadeMusicStateManager.songsQueue[0]
          ),
        });

        BotHomemadeGeneralState.audioPlayer.play(
          (await generateSpotifyAudioStream(
            track.url
          )) as AudioResource<unknown>
        );
      }
      // Continue to play any song left in queue normoally
      else if (BotHomemadeMusicStateManager.songsQueue.length > 1) {
        // Continue to play song like normally if queue is not empty
        playSong(BotHomemadeMusicStateManager.songsQueue[0].url);
      }
    });
  },
};

export default autoplayCommand;
