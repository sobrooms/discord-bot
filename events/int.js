const { EmbedBuilder } = require('discord.js')
const config = require('../config.json')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      await command.execute(interaction);
      const c = interaction.client.channels.cache.get(config.server_channels.acLog);
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
      c.send({ embeds: [m] });
    } catch (error) {
      return console.error(error);
    }
    if (interaction.isAutocomplete()) {
      // get command
      const command = client.commands.get(interaction.commandName);
      // if command is not found then return
      if (!command) {
        return;
      }

      try {
        // execute autocomplete
        const c = interaction.client.channels.cache.get(require('../config.json').server_channels.acLog));
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
        const c = interaction.client.channels.cache.get(require('../config.json').server_channels.acLog);
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