import { joinCommand } from "../../commands/join";
import { playCommand } from "../../commands/play";
import { queueCommand } from "../../commands/queue";
import { skipCommand } from "../../commands/skip";
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
  let command: Command | null = null;

  switch (commandName) {
    case "join":
      command = joinCommand;
      break;
    case "play":
      command = playCommand;
      break;
    case "skip":
      command = skipCommand;
      break;
    case "queue":
      command = queueCommand;
      break;
    default:
      break;
  }

  return command;
};

// Get Command Query
export const getQuery = (textMessage: string): string => {
  return textMessage.substring(textMessage.indexOf(" ") + 1);
};
