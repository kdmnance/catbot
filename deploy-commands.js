import { __dirname, __filename, CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "./common.js";
import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

const commands = [];
const foldersPath = join(__dirname, "src", "commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath)
      .then((module) => module.default)
      .catch((error) => {
        console.error(`[ERROR] An error occurred while importing the command at ${filePath}: ${error}`);
      });

    if (!command) break;
    else if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
