import { createAudioPlayer } from "@discordjs/voice";

import { BotHomemade, BotHomemadeMusicState } from "./types";

export const BotHomemadeGeneralState: BotHomemade = {
  voiceConnection: null,
  channelId: null,
  guildId: null,
  audioPlayer: createAudioPlayer(),
};

export const clearGeneralState = () => {
  BotHomemadeGeneralState.voiceConnection?.destroy();
  BotHomemadeGeneralState.channelId = null;
  BotHomemadeGeneralState.audioPlayer.stop();
  BotHomemadeGeneralState.audioPlayer.removeAllListeners();
};

export const BotHomemadeMusicStateManager: BotHomemadeMusicState = {
  songsQueue: [],
};

export const clearAudioState = () => {
  BotHomemadeMusicStateManager.songsQueue = [];
};
