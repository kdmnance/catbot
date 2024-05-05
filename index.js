import { __dirname, __filename, DISCORD_TOKEN } from "./common.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// register the commands
client.commands = new Collection();
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
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// register the events
const eventsPath = join(__dirname, "src", "events");
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = await import(filePath)
    .then((module) => module.default)
    .catch((error) => {
      console.error(`[ERROR] An error occurred while importing the event at ${filePath}: ${error}`);
    });

  if (!event) break;
  else if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(DISCORD_TOKEN);
