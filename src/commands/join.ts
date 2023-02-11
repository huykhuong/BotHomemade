import { Message } from "discord.js";

import { GeneralCommand } from "../types";

export const joinCommand: GeneralCommand = {
  type: "general",
  name: "join",
  run: async (message: Message) => {
    console.log(message);
  },
};
