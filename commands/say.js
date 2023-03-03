const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  description: "Echoes input text",
  usage: "</say:0> **<text (to repeat, type: string)>**",
  hidden: false,
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Echoes input text")
    .addStringOption(option=>option.setName("text").setDescription("Text to echo").setRequired(true)),
  async execute(i) {
    await i.reply({ content: "echoed text: " + i.options.getString("text"), ephemeral: true });
    return i.client.channels.cache.get(i.channel.id).send(i.options.getString("text"));
  }
}
