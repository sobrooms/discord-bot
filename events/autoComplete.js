const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            await require("../util/log")("EVENT-LOG", "Autocomplete event was triggered")
            // get command
            const command = interaction.client.commands.get(interaction.commandName);
            // if command is not found then return
            if (!command) {
                return require('../util/log')("CMD-LOG", "Couldn't find command while responding to autocomplete.")
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
                    .setTimestamp()
                c.send({ embeds: [mb] })
            } catch (err) {
                const c = interaction.client.channels.cache.get(require('../config.json').server_channels.acLog);
                await require('../util/log')("EVENT-LOG", "Autocomplete event failed with error:\n" + err);
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
                    .setTimestamp()
                c.send({ embeds: [mb] })
                return interaction.respond([{ name: 'Hey, if you\'re seeing this, the bot has failed to respond to your autocomplete interaction.', value: 'h' }]);
            }
        }
    }
}
