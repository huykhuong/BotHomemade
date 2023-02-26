import { createAudioPlayer } from "@discordjs/voice";
import { BotHomemade, BotHomemadeMusicState } from "@types";
import dotenv from "dotenv";
import Spotify from "spotifydl-core/dist";


dotenv.config();

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
  autoplay: false,
  spotify: {
    downloaderInstance: new Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
    expireTimestamp: "",
    accessToken: null,
  },
};

// Clear General Audio State
export const clearAudioState = () => {
  BotHomemadeMusicStateManager.songsQueue = [];
  BotHomemadeMusicStateManager.paused = false;
  BotHomemadeMusicStateManager.autoplay = false;
  BotHomemadeMusicStateManager.spotify = {
    expireTimestamp: "",
    downloaderInstance: null,
    accessToken: null,
  };
};
