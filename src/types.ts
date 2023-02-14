import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";

export type AvailableCommands = "join" | "play" | "skip" | "queue" | "remove";

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

// Music State
export interface BotHomemadeMusicState {
  songsQueue: Song[];
}

// Command Types
export interface GeneralCommand extends AbstractCommand<"general"> {
  run: (
    message: Message,
    BotHomemadeGeneralState: BotHomemade
  ) => Promise<void>;
}

export interface MusicCommand extends AbstractCommand<"music"> {
  run: (
    message: Message,
    botHomemadeMusicState: BotHomemadeMusicState,
    BotHomemadeGeneralState: BotHomemade
  ) => Promise<void>;
}

export type Command = GeneralCommand | MusicCommand;
