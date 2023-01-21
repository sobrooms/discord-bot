const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require("discord-api-types/v10");
module.exports = {
  description: 'Pretty obvious, it shuts down the bot. Can only be used by admins.',
  usage: '</shutdown:0> **<exit code, type: integer>**',
  hidden: true,
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("kills the bot")
    .addIntegerOption(option => option.setName("exitcode").setDescription("exit code").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.reply(`Killed node process with exit code: ${interaction.options.getInteger("exitcode")}`);
    const ch = interaction.client.channels?.cache?.get("1065859892335886437");
    const emb = new EmbedBuilder()
      .setTitle("Process killed")
      .setDescription(`Process killed by ${interaction.user.tag}`)
      .addFields({
        name: 'Time',
        value: `${Date.now()} - ${new Date()}`
      })
      .setColor("#32a852")
      .setTimestamp();
    await ch?.send({ content: '<@716491639857872928>', embeds: [emb] });
    return process.exit(interaction.options.getInteger("exitcode"));
  }
}