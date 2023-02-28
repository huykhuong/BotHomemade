import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";
import SpotifyFetcher from "spotifydl-core/dist/Spotify";

export type AvailableCommands =
  | "join"
  | "play"
  | "skip"
  | "queue"
  | "remove"
  | "pause"
  | "unpause"
  | "autoplay"
  | "stop"
  | "lck"
  | "lpl";

type CommandTypes = "general" | "music";

type AbstractCommand<T extends CommandTypes> = {
  type: T;
  name: string;
};

// Bot State Manager
export interface BotHomemade {
  guildId: string | null;
  channelId: string | null;
  voiceConnection: VoiceConnection | null;
  audioPlayer: AudioPlayer;
}

// Song interface
export interface Song {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  requester: string;
}

// SpotifySearchResult interface
export interface SpotifySearchResult {
  spotify: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: { images: { url: string }[] };
  duration: string;
}

// Music State
export interface BotHomemadeMusicState {
  songsQueue: Song[];
  paused: boolean;
  autoplay: boolean;
  spotify: {
    downloaderInstance: SpotifyFetcher | null;
    expireTimestamp: string;
    accessToken: string | null;
  };
}

// Command Types
export interface GeneralCommand extends AbstractCommand<"general"> {
  run: (message: Message) => Promise<void>;
}

export interface MusicCommand extends AbstractCommand<"music"> {
  run: (message: Message) => Promise<void>;
}

export type Command = GeneralCommand | MusicCommand;
