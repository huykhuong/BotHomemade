import { BotHomemadeGeneralState } from "@StateManager";
import {
  AudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import { BotHomemade } from "@types";
import { Message } from "discord.js";

export const sendRandomCommandResponse = (respArr: string[]): string => {
  return respArr[Math.floor(Math.random() * respArr.length)];
};

export const checkInVoiceChannel = (
  message: Message,
  responseSamples: string[]
): boolean => {
  const voiceChannel = message.member?.voice.channel;

  if (!voiceChannel) {
    message.channel.send(sendRandomCommandResponse(responseSamples));
    return false;
  }

  return true;
};

export const checkIsPlayingMusicOrInVoiceChannel = (
  message: Message,
  voiceConnection: VoiceConnection | null
): boolean => {
  if (!voiceConnection) {
    message.channel.send("Tell me to play a song or join a room first!");
    return false;
  }

  return true;
};

export const createVoiceConnection = (
  audioPlayer: AudioPlayer,
  voiceConnection: VoiceConnection | null,
  message: Message
): void => {
  if (message.member?.voice.channel) {
    if (
      !voiceConnection ||
      message.member.voice.channel.id !== BotHomemadeGeneralState.channelId
    ) {
      const newVoiceConnection = joinVoiceChannel({
        channelId: message.member?.voice.channel.id,
        guildId: message.member?.voice.channel.guildId,
        adapterCreator: message.member?.voice.channel.guild.voiceAdapterCreator,
      });

      setStateBotHomemade(
        BotHomemadeGeneralState,
        message.member.voice.channel.id,
        message.guild?.id || "",
        newVoiceConnection
      );

      newVoiceConnection.subscribe(audioPlayer);
    }
  }
};

function setStateBotHomemade(
  state: BotHomemade,
  channelId: string,
  guildId: string,
  voiceConnection: VoiceConnection
): void {
  state.channelId = channelId;
  state.guildId = guildId;
  state.voiceConnection = voiceConnection;
}
