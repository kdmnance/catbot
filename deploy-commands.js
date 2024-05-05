import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;
const CATBOT_DIR = process.env.CATBOT_DIR;

const COMMANDS_DIR = `file:\\\\${CATBOT_DIR}\\src\\commands`;

console.log(__dirname);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = ["file:\\", __dirname, "src", "commands"].join("\\");
console.log(foldersPath);
const commandFolders = fs.readdirSync(foldersPath);
console.log(commandFolders);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath).then((res) => res.default);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// // Construct and prepare an instance of the REST module
// const rest = new REST().setToken(token);

// // and deploy your commands!
// (async () => {
//   try {
//     console.log(
//       `Started refreshing ${commands.length} application (/) commands.`
//     );

//     // The put method is used to fully refresh all commands in the guild with the current set
//     const data = await rest.put(
//       Routes.applicationGuildCommands(clientId, guildId),
//       { body: commands }
//     );

//     console.log(
//       `Successfully reloaded ${data.length} application (/) commands.`
//     );
//   } catch (error) {
//     // And of course, make sure you catch and log any errors!
//     console.error(error);
//   }
// })();
