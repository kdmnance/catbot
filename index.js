import dotenv from "dotenv";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CATBOT_DIR = process.env.CATBOT_DIR;

const COMMANDS_DIR = `file:\\\\${CATBOT_DIR}\\src\\commands`;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const ping = await import(`${COMMANDS_DIR}\\utility\\ping.js`).then((res) => res.default);
client.commands.set(ping.data.name, ping);

const user = await import(`${COMMANDS_DIR}\\utility\\user.js`).then((res) => res.default);
client.commands.set(user.data.name, user);

const server = await import(`${COMMANDS_DIR}\\utility\\server.js`).then((res) => res.default);
client.commands.set(server.data.name, server);

console.log(client.commands);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);
