const { EmbedBuilder } = require('discord.js')
const logChannel = require('../config.json').server_channels.acLog;

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
  if (interaction.isChatInputCommand()) {
    try {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.log(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      await command.execute(interaction);
      const c = interaction.client.channels.cache.get(logChannel);
      const m = new EmbedBuilder()
        .setTitle('Command was used | Logs')
        .addFields({
          name: 'Member',
          value: interaction.user.username + ' (<@' + interaction.user.id + '> - ' + interaction.user.id + ')',
          inline: true
        })
        .setTimestamp(new Date())
        .addFields({
          name: 'Command name',
          value: '/' + interaction.commandName,
          inline: true
        })
        .setColor(require('../config.json').sobColor);
      if (interaction.guild) {
        m.addFields({
          name: 'Channel command was used in',
          value: '#' + interaction.channel.name || "DMs " + ' (<#' + interaction.guild.name || "undefined" + '>)',
          inline: true
        })
      }
      c?.send({ embeds: [m] });
    } catch (error) {
      return console.error(error);
    }} else if (interaction.isAutocomplete()) {
      // get command
      const command = client.commands.get(interaction.commandName);
      // if command is not found then return
      if (!command) {
        return;
      }

      try {
        // execute autocomplete
        const c = interaction.client.channels.cache.get(logChannel);
        await command.autocomplete(interaction);
        const mb = new EmbedBuilder()
          .setTitle("Responded to autocomplete")
          .addFields({
            name: 'Used by',
            value: interaction.user.username + ' (<@' + interaction.user.id + '> - ' + interaction.user.id + ')',
            inline: true
          })
          .addFields({
            name: 'Command name',
            value: '/' + interaction.commandName,
            inline: true
          })
          .setColor(require('../config.json').sobColor)
          .setTimestamp(new Date())
        c.send({ embeds: [mb] })
      } catch (err) {
        const c = interaction.client.channels.cache.get(logChannel);
        console.error(err)
        const mb = new EmbedBuilder()
          .setTitle("Failed to respond to autocomplete")
          .addFields({
            name: 'Used by',
            value: interaction.user.username + ' (<@' + interaction.user.id + '> - ' + interaction.user.id + ')',
            inline: true
          })
          .setColor(require('../config.json').sobColor)
          .addFields({
            name: 'Command name',
            value: '/' + interaction.commandName,
            inline: true
          })
          .setTimestamp(new Date())
        c.send({ embeds: [mb] })
      }
    }
  }
};
