import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";
import dotenv from "dotenv";

import { clearAudioState, clearGeneralState } from "./StateManager";
dotenv.config();
import { AvailableCommands } from "./types";
import { extractCommandNameFromText, getCommand } from "./utilities/commands";
import { commandAliases } from "./variables";

//Config
const CONFIG = {
  prefix: ".",
};

// Initializing BotHommade client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("ready", () => {
  if (!client.user) return;

  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setUsername("Bot Homemade");
  client.user.setActivity(`music for the homies`, {
    type: ActivityType.Playing,
  });
});

// Message Listener Area
let commandName: AvailableCommands | null = null;

client.on("messageCreate", async (message) => {
  const textMessage = message.content;

  if (!message.guild || !textMessage.startsWith(CONFIG.prefix)) return;

  const keyword = extractCommandNameFromText(textMessage);

  if (commandAliases.get(keyword)) {
    commandName = commandAliases.get(keyword) as AvailableCommands;
  } else {
    commandName = keyword;
  }

  const command = getCommand(commandName as AvailableCommands);

  if (command) {
    switch (command.type) {
      case "general":
        command.run(message);
        break;
      case "music":
        command.run(message);
        break;
    }
  } else {
    await message.channel.send("Dunno whatcha saying bro!");
  }
});

// Task to run when Bot is disconnected
client.on("voiceStateUpdate", (oldState, newState) => {
  // If user or bot leaves a voice channel
  if (oldState.channelId && !newState.channelId) {
    if (!newState) return;

    // Bot was disconnected
    if (newState) {
      if ((newState.id as string) === client.user?.id) {
        clearGeneralState();
        clearAudioState();
        return;
      }
    }
  }
});

// DO LOGIN
client.login(process.env.CLIENT_TOKEN);
