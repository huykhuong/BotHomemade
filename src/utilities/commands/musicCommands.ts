import { AudioResource, createAudioResource } from "@discordjs/voice";
import SpotifyFetcher from "spotifydl-core/dist/Spotify";
import ytdl from "ytdl-core";

import { Readable } from "stream";

import {
  BotHomemadeGeneralState,
  BotHomemadeMusicStateManager,
} from "../../StateManager";
import { Song } from "../../types";

export const generateAudioStream = (link: string): AudioResource => {
  const track = ytdl(link || "", {
    filter: "audioonly",
    highWaterMark: 1 << 25,
  });

  if (!track) {
    console.log("vcl");
  }

  const resource = createAudioResource(track, {
    inlineVolume: true,
  });

  return resource;
};

export const generateSpotifyAudioStream = async (
  trackUrl: string
): Promise<AudioResource<unknown> | undefined> => {
  const spotifyDownloader = BotHomemadeMusicStateManager.spotify
    .downloaderInstance as SpotifyFetcher;

  const downloadResult = await spotifyDownloader.downloadTrack(trackUrl);

  if (!downloadResult) return;

  const resource = createAudioResource(Readable.from(downloadResult), {
    inlineVolume: true,
  });

  return resource;
};

export const createSongObject = (
  url: string,
  title: string,
  author: string,
  thumbnail: string,
  duration: string,
  nextURL: string,
  requester: string
): Song => {
  const song: Song = {
    url,
    title,
    author,
    thumbnail,
    duration,
    requester,
    nextURL,
  };

  return song;
};

export const playSong = async (songUrl: string) => {
  if (ytdl.validateURL(songUrl)) {
    BotHomemadeGeneralState.audioPlayer.play(generateAudioStream(songUrl));
  } else {
    BotHomemadeGeneralState.audioPlayer.play(
      (await generateSpotifyAudioStream(songUrl)) as AudioResource<unknown>
    );
  }
};
