const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            let logChannel = interaction.client.channels.cache.get(require('../config.json').server_channels.acLog);
            await require("../util/log")("EVENT-LOG.back", "Autocomplete event was triggered", false,true)
            // get command
            const command = interaction.client.commands.get(interaction.commandName);
            // if command is not found then return
            if (!command) {
                return require('../util/log')("EVENT-LOG.back", "Couldn't find the executed command while responding to autocomplete. (Triggered by " + interaction.user.username + ")", false,true)
            }
            try {
                // execute autocomplete
                const c = logChannel;
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
                        value: `</${interaction.commandName}:${interaction.commandId}>`,
                        inline: true
                    })
                    .setColor(require('../config.json').sobColor)
                    .setTimestamp()
                c.send({ embeds: [mb] })
                require('../util/log')('EVENT-LOG.back', `Successfully responded to an autocomplete interaction. (Triggered by ${interaction.user.username})`, false, true)
            } catch (err) {
                const c = logChannel;
                await require('../util/log')("EVENT-LOG.back", "Autocomplete event failed with error:\n" + err, false, true);
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
