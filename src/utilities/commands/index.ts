import { Message } from "discord.js";

import autoplayCommand from "../../commands/autoplay";
import { joinCommand } from "../../commands/join";
import { pauseCommand } from "../../commands/pause";
import { playCommand } from "../../commands/play";
import { queueCommand } from "../../commands/queue";
import { removeCommand } from "../../commands/remove";
import { skipCommand } from "../../commands/skip";
import { unpauseCommand } from "../../commands/unpause";
import { AvailableCommands, Command, Song } from "../../types";
import { colors } from "../../variables";

// Get The Command Name
export const extractCommandNameFromText = (
  textMessage: string
): AvailableCommands => {
  if (textMessage.includes(" ")) {
    return textMessage.substring(
      1,
      textMessage.indexOf(" ")
    ) as AvailableCommands;
  } else {
    return textMessage.substring(1) as AvailableCommands;
  }
};

// Get Command Object
export const getCommand = (commandName: AvailableCommands): Command | null => {
  switch (commandName) {
    case "join":
      return joinCommand;
    case "play":
      return playCommand;
    case "skip":
      return skipCommand;
    case "queue":
      return queueCommand;
    case "remove":
      return removeCommand;
    case "pause":
      return pauseCommand;
    case "unpause":
      return unpauseCommand;
    case "autoplay":
      return autoplayCommand;
    default:
      return null;
  }
};

// Get Command Query Keyword
export const getQuery = (textMessage: string): string => {
  return textMessage.substring(textMessage.indexOf(" ") + 1);
};

// Message Channel Send
export function sendMessageToChannel(
  message: Message,
  title: string,
  description: string
) {
  message.channel.send({
    embeds: [
      {
        title,
        description,
        color: colors.embedColor,
      },
    ],
  });
}

export function sendMessageMusicToChannel(
  message: Message,
  song: Song,
  addToQueue = false
) {
  message.channel.send({
    embeds: [
      {
        title: addToQueue
          ? `${song.requester} added ${song.title} to the queue`
          : `Playing ${song.title}`,
        description: `Author: ${song.author} | Duration: ${song.duration}`,
        url: song.url,
        fields: addToQueue
          ? undefined
          : [{ name: `Requester: ${song.requester}`, value: "" }],
        image: { url: song.thumbnail },
        color: colors.embedColor,
      },
    ],
  });
}
