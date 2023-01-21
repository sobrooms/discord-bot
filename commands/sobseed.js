const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const v = require('../util/sobseed');
const v2 = require('../util/so.json').vtwopone;
module.exports = {
  description: 'stuff for sobseedps',
  usage: '</sobseed:0>',
  data: new SlashCommandBuilder()
    .setName("sobseed")
    .setDescription("help for SobseedPS i guess"),
  async execute(interaction) {
    const latestRel = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("rel")
          .setLabel("Check latest release")
          .setStyle(ButtonStyle.Primary),
      )
    const htu = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("How do I use this?")
          .setURL("https://docs.ps.rrryfoo.cf/Hy/animegame1/with-grasscutter#connecting-with-sobseedps")
          .setStyle(ButtonStyle.Link)
      )
    const dl = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Download sobseed_" + v?.lts + ".jar")
          .setURL(v2?.download)
          .setStyle(ButtonStyle.Link)
      )
    const filter = i => i.user.id === i.user.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
    const ltsv = new EmbedBuilder()
      .setTitle(v?.lts)
      .setDescription(v2?.details)
      .addFields({
        name: 'Changes in this update',
        value: v2?.changes
      })
      .setColor(require('../config.json').sobColor)
    const embmain = new EmbedBuilder()
      .setTitle("SobseedPS")
      .setDescription("SobseedPS is sobroom's first *anime game* private server (Grasscutter clon)")
      .setColor(require('../config.json').sobColor)
    await interaction.reply({ embeds: [embmain], components: [latestRel] })
    collector.on('collect', async (i) => {
      if (i.customId === "rel") {
        await interaction.editReply({ embeds: [ltsv], components: [htu, dl] });
      };
    });
  }
}