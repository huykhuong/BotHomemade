import { Song } from "@types";
import { Message } from "discord.js";

import { searchAndGetSpotifySong } from "./searchTrack";


export const generateAutoplayTrack = async (
  rootSong: Song,
  message: Message
): Promise<Song | undefined> => {
  const { author } = rootSong;

  const SpotifySongObj = await searchAndGetSpotifySong(message, author);

  // Error checking
  if (!SpotifySongObj) {
    message.channel.send("Something's not working");
    return;
  }

  return SpotifySongObj;
};
