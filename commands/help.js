const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  description: "send this message",
  usage: '</help:0> *<OPTIONAL: command (name)>*\nExample: </help:0> *command:* *sob*',
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sends help")
    .addStringOption(option => option
      .setName("command")
      .setDescription("command name to get help on")
      .setAutocomplete(true)),
  async autocomplete(interaction) {
    const gcm = interaction.client.commands.map(command => command.data.name);
    const gmc = interaction.options.getString("command");
    const command = [];
    for (const cmd of gcm) {
      if (cmd.toLowerCase().startsWith(gmc.toLowerCase())) {
        command.push({
          name: cmd,
          value: cmd
        })
      } else if (gmc.toLowerCase().startsWith(cmd.toLowerCase())) {
        command.push({
          name: cmd,
          value: cmd
        })
      }
    }
    interaction.respond(command);
  },
  async execute(interaction) {
    const command = interaction.options.getString("command")?.toLowerCase();
    const allSlash = interaction.client.commands.map(command => command.data.name);
    const embed = new EmbedBuilder()
      .setTitle("Bot help")
      .setDescription(interaction.client.user.username + ", in " + interaction.guild.name + "\nA bot made for the [sobrooms](https://sobroom.rrryfoo.cf) group, which was made by [rrryfoo](https://rrryfoo.cf).")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(require('../config.json').sobColor)
    Object.values(allSlash).map(slashCommandName => {
      const isHidden = require('./' + slashCommandName + '.js').hidden || false;
      if (isHidden === true) {} else {
        embed.addFields({
          name: '/' + slashCommandName,
          value: require('./' + slashCommandName + '.js').description || "A command without a description",
          inline: true
        })
      }
    })
    if (!command) {
      return interaction.reply({ embeds: [embed] })
    }
    if (command) {
      if (allSlash.includes(command)) {
        const embed2 = new EmbedBuilder()
          .setTitle("/"+interaction.options.getString("command").toLowerCase())
          .addFields({
            name: 'Command description',
            value: require('./' + command + '.js').description || "This command has no description"
          })
          .addFields({
            name: 'Usage',
            value: require('./' + command + '.js').usage || "This command has no usage written"
          })
          .setColor(require('../config.json').sobColor);
        return interaction.reply({ embeds: [embed2] })
      } else {
        return interaction.reply({ content: 'Command does not exist.', ephemeral: true })
      }
    }
  }
}
