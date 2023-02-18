import { Message } from "discord.js";

import { authenticateAccessToken } from "./authenticate";

import { BotHomemadeMusicStateManager } from "../../StateManager";
import { Song } from "../../types";
import { createSongObject } from "../commands/musicCommands";
import { getRequesterName } from "../users";

export const searchAndGetSpotifySong = async (
  message: Message,
  query?: string,
  nextURL?: string
) => {
  const {
    spotify: { accessToken, expireTimestamp },
  } = BotHomemadeMusicStateManager;

  // Check to see if access token has expired
  if (!accessToken || Date.now() > Date.parse(expireTimestamp)) {
    const newlyRequestedAccessToken = await authenticateAccessToken();

    return buildSongObject(message, nextURL, query, newlyRequestedAccessToken);
  }

  return buildSongObject(message, nextURL, query, accessToken);
};

async function buildSongObject(
  message: Message,
  nextURL: string | undefined,
  query: string | undefined,
  accessToken: string
) {
  let songObj = {} as Song;

  if (!nextURL) {
    const searchResult = await searchSong(
      `https://api.spotify.com/v1/search?query=${query}&type=track&locale=*&offset=0&limit=1`,
      accessToken
    );

    songObj = createSongObject(
      searchResult.spotify,
      searchResult.name,
      searchResult.artists[0].name,
      searchResult.album.images[0].url,
      searchResult.duration_ms,
      searchResult.nextURL,
      getRequesterName(message.author.id)
    );
  }
  // This part is for Autoplay, getting link from Spotify's next link
  else {
    const searchResult = await searchSong(nextURL, accessToken);

    songObj = createSongObject(
      searchResult.spotify,
      searchResult.name,
      searchResult.artists[0].name,
      searchResult.album.images[0].url,
      searchResult.duration_ms,
      searchResult.nextURL,
      getRequesterName(message.author.id)
    );
  }

  return songObj;
}

async function searchSong(query: string, accessToken: string) {
  const response = await fetch(query, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();

  const {
    external_urls: { spotify },
    name,
    artists,
    album,
    duration_ms,
  } = data.tracks.items[0];

  return {
    spotify,
    name,
    artists,
    album,
    duration_ms,
    nextURL: data.tracks.next,
  };
}
