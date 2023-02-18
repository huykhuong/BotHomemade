import { AudioResource, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

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
