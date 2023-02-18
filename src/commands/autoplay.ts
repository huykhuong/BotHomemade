import { Message } from "discord.js";

import { BotHomemadeMusicStateManager } from "../StateManager";
import { MusicCommand } from "../types";
import { searchAndGetSpotifySong } from "../utilities/spotify/searchTrack";

const autoplayCommand: MusicCommand = {
  type: "music",
  name: "autoplay",
  run: async (message: Message<boolean>) => {
    BotHomemadeMusicStateManager.songsQueue.shift();

    const SpotifySongObj = await searchAndGetSpotifySong(
      message,
      "justin bieber",
      BotHomemadeMusicStateManager.songsQueue.length > 0
        ? BotHomemadeMusicStateManager.songsQueue[0].nextURL
        : undefined
    );

    // Error checking
    if (!SpotifySongObj) {
      message.channel.send("Something's not working");
      return;
    }

    BotHomemadeMusicStateManager.songsQueue.push(SpotifySongObj);
  },
};

export default autoplayCommand;
