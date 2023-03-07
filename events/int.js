const { EmbedBuilder } = require('discord.js')
const logChannel = require('../config.json').server_channels.acLog;

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await require('../util/log')("EVENT-LOG", "ChatInputCommand event was triggered")
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
        m.addFields({
          name: 'Channel and command was used in',
          value: interaction.guild ? `Command was used in <#${interaction.channel.id}> in guild "${interaction.channel.name}"` : "Direct/private messages",
          inline: true
        });
        c?.send({ embeds: [m] });
      } catch (error) {
        return console.error(error);
      }
    }
  }
};
