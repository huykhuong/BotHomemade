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
  player: AudioPlayer,
  message: Message,
  responseSamples: string[],
  voiceConnection: VoiceConnection | null
) => {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    message.channel.send(sendRandomCommandResponse(responseSamples));
    return;
  }

  if (!voiceConnection) {
    voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guildId || "",
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    voiceConnection.subscribe(player);
  }
};
