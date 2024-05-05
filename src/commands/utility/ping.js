import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("replies with pong");

const execute = async (interaction) => {
  await interaction.reply("pong");
};

export default {
  data,
  execute,
};
