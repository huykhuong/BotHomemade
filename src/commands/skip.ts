import ytdl from "ytdl-core";

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
    const { songsQueue, autoplay } = botHomemadeMusicState;
    const { audioPlayer } = BotHomemadeGeneralState;

    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    if (!autoplay) {
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

        songsQueue.shift();

        if (ytdl.validateURL(songsQueue[0].url))
          audioPlayer.play(generateAudioStream(songsQueue[0].url));

        // audioPlayer.play(
        //   (await generateSpotifyAudioStream(
        //     songsQueue[0].url
        //   )) as AudioResource<unknown>
        // );
      }
    } else {
      audioPlayer.stop();

      songsQueue.shift();
    }
  },
};
