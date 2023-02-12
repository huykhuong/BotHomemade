import {
  AudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
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

export const createVoiceConnection = (
  audioPlayer: AudioPlayer,
  voiceConnection: VoiceConnection | null,
  message: Message
): void => {
  const voiceChannel = message.member?.voice.channel;

  if (!voiceChannel) return;

  if (!voiceConnection) {
    voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    voiceConnection.subscribe(audioPlayer);
  }
};
