import { SlashCommandBuilder } from "discord.js";

export default ping = () => {
  const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong");

  const execute = async (interaction) => {
    await interaction.reply("pong");
  };
};
