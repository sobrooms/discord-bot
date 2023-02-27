const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  description: 'Windy!',
  usage: 'No extra parameters or options',
  data: new SlashCommandBuilder()
    .setName("windy")
    .setDescription("windy"),
  async execute(interaction) {
    return interaction.client.channels.cache.get(interaction.channel.id).send("https://media.discordapp.net/stickers/1016046610289012796.png?size=320");
  }
}