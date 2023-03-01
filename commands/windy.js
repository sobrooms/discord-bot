const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  description: 'Windy!',
  usage: 'No extra parameters or options',
  data: new SlashCommandBuilder()
    .setName("windy")
    .setDescription("windy"),
  async execute(interaction) {
    const c = interaction.client.channels.cache.get(interaction.channel.id);
    const ma = new EmbedBuilder()
      .setTitle("Windy")
      .setDescription("A dangerous packet in *anime game* that can run malicious code on your local machine.")
      .setImage("https://media.discordapp.net/stickers/1016046610289012796.png?size=320")
      .setTimestamp()
      .setColor(require('../config.json').sobColor);
    return c.send({ embeds: [ma] });
  }
}