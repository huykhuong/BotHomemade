import { joinCommand } from "../../commands/join";
import { pauseCommand } from "../../commands/pause";
import { playCommand } from "../../commands/play";
import { queueCommand } from "../../commands/queue";
import { removeCommand } from "../../commands/remove";
import { skipCommand } from "../../commands/skip";
import { unpauseCommand } from "../../commands/unpause";
import { AvailableCommands, Command } from "../../types";

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
    default:
      return null;
  }
};

// Get Command Query
export const getQuery = (textMessage: string): string => {
  return textMessage.substring(textMessage.indexOf(" ") + 1);
};
