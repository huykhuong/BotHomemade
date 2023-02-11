import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { Client, Message } from "discord.js";

type CommandTypes = "general" | "music";

type AbstractCommand<T extends CommandTypes> = {
  type: T;
  name: string;
};

// Song interface
export interface Song {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
}

export type AvailableCommands = "join" | "play";

// Music State
export interface BotHomemadeMusicState {
  songsQueue: Song[];
  audioPlayer: AudioPlayer;
  voiceConnection: VoiceConnection | null;
}

// Command Types
export interface GeneralCommand extends AbstractCommand<"general"> {
  run: (message: Message) => Promise<void>;
}

export interface MusicCommand extends AbstractCommand<"music"> {
  run: (
    message: Message,
    botHomemadeMusicState: BotHomemadeMusicState,
    client?: Client
  ) => Promise<void>;
}

export type Command = GeneralCommand | MusicCommand;
