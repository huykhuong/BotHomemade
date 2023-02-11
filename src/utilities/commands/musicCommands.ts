import { AudioResource, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

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
