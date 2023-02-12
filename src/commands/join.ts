import { joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import { GeneralCommand } from "../types";

export const joinCommand: GeneralCommand = {
  type: "general",
  name: "join",
  run: async (message: Message) => {
    // If requester is not in a voice channel
    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    // If there is no voice connection then create one
    if (message.member?.voice.channel) {
      joinVoiceChannel({
        channelId: message.member?.voice.channel.id,
        guildId: message.member?.voice.channel.guildId,
        adapterCreator: message.member?.voice.channel.guild.voiceAdapterCreator,
      });
    }
  },
};
