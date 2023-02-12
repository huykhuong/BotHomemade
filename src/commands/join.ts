import { joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";

import responseSamples from "./randomResponseCollection.json";
import { checkInVoiceChannel } from "./utils";

import { GeneralCommand } from "../types";

export const joinCommand: GeneralCommand = {
  type: "general",
  name: "join",
  run: async (message: Message) => {
    if (!checkInVoiceChannel(message, responseSamples.joinCommand.failed)) {
      return;
    }

    if (message.member?.voice.channel) {
      joinVoiceChannel({
        channelId: message.member?.voice.channel.id,
        guildId: message.member?.voice.channel.guildId,
        adapterCreator: message.member?.voice.channel.guild.voiceAdapterCreator,
      });
    }
  },
};
