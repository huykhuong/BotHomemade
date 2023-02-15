import { createAudioPlayer } from "@discordjs/voice";

import { BotHomemade, BotHomemadeMusicState } from "./types";

export const BotHomemadeGeneralState: BotHomemade = {
  voiceConnection: null,
  channelId: null,
  guildId: null,
  audioPlayer: createAudioPlayer(),
};

// Clear General State
export const clearGeneralState = () => {
  BotHomemadeGeneralState.voiceConnection?.destroy();
  BotHomemadeGeneralState.channelId = null;
  BotHomemadeGeneralState.audioPlayer.stop();
  BotHomemadeGeneralState.audioPlayer.removeAllListeners();
};

export const BotHomemadeMusicStateManager: BotHomemadeMusicState = {
  songsQueue: [],
  paused: false,
};

// Clear General Audio State
export const clearAudioState = () => {
  BotHomemadeMusicStateManager.songsQueue = [];
};
