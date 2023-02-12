//IMPORT modules needed for Discord Bot Base
import { createAudioPlayer } from "@discordjs/voice";
import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
import { AvailableCommands, BotHomemadeMusicState } from "./types";
import { extractCommandNameFromText, getCommand } from "./utilities/commands";
import { commandAliases } from "./variables";

//Config
const CONFIG = {
  prefix: ".",
};

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

// Constructing BotHomemade instance
const BotHomemadeMusicStateManager: BotHomemadeMusicState = {
  songsQueue: [],
  audioPlayer: createAudioPlayer(),
  voiceConnection: null,
};

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
        command.run(message, BotHomemadeMusicStateManager, client);
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
    if ((newState.id as string) === client.user?.id) {
      BotHomemadeMusicStateManager.songsQueue = [];
      BotHomemadeMusicStateManager.voiceConnection?.destroy();
      BotHomemadeMusicStateManager.audioPlayer.removeAllListeners();
      BotHomemadeMusicStateManager.audioPlayer.stop();
      return;
    }
  }
});

// DO LOGIN
client.login(process.env.CLIENT_TOKEN);
