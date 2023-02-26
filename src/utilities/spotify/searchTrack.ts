import { BotHomemadeMusicStateManager } from "@StateManager";
import { Song, SpotifySearchResult } from "@types";
import { Message } from "discord.js";

import { authenticateAccessToken } from "./authenticate";


import { createSongObject } from "../commands/musicCommands";
import { getRequesterName } from "../users";

export const searchAndGetSpotifySong = async (
  message: Message,
  author: string | undefined
) => {
  const {
    spotify: { accessToken, expireTimestamp },
  } = BotHomemadeMusicStateManager;

  // Check to see if access token has expired
  if (!accessToken || Date.now() > Date.parse(expireTimestamp)) {
    const newlyRequestedAccessToken = await authenticateAccessToken();

    return buildSongObject(message, author, newlyRequestedAccessToken);
  }

  return buildSongObject(message, author, accessToken);
};

async function buildSongObject(
  message: Message,
  author: string | undefined,
  accessToken: string
) {
  let songObj = {} as Song;

  const searchResult = await searchSong(
    `https://api.spotify.com/v1/search?query=${encodeURIComponent(
      author || ""
    )}&type=track&locale=*&offset=${Math.floor(Math.random() * 50)}&limit=1`,
    accessToken
  );

  songObj = createSongObject(
    searchResult.spotify,
    searchResult.name,
    searchResult.artists[0]?.name,
    searchResult.album.images[0].url,
    searchResult.duration_ms.toString(),
    getRequesterName(message.author.id)
  );

  return songObj;
}

async function searchSong(
  query: string,
  accessToken: string
): Promise<SpotifySearchResult> {
  const response = await fetch(query, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!data.tracks.items[0]) {
    return searchSong(
      `https://api.spotify.com/v1/search?query=%25a%25&type=track&locale=*&offset=${Math.floor(
        Math.random() * 10
      )}&limit=1`,
      accessToken
    );
  } else {
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
    };
  }
}
