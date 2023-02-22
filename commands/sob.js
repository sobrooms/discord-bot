// require slash command builder
const { SlashCommandBuilder } = require('discord.js');
// require logger
const log = require('../util/log')
// export modules
module.exports = {
  // set description for the help command
  description: "sobs in the channel you're in, thats it (optional amount of times and channel)",
  usage: '</sob:0> *<OPTIONAL: times (to sob, type: integer)>* *<OPTIONAL: channel (to sob in, type: channel (ID, integer/string))>*',
  hidden: false,
  // create slash command
  data: new SlashCommandBuilder()
    .setName("sob")
    .setDescription("sob")
    .addStringOption(option =>
      option
        .setRequired(false)
        .setName("type")
        .setDescription("emoji to use (if no option picked, use default)")
        .addChoices(
          { name: 'plate', value: '<:sob_plate:1052912465249320990>' },
          { name: 'fill', value: '<:sobfill:1052912254980464721>' },
          { name: 'roll', value: '<a:sob_roll:1062703781030154240>' }
        ))
    .addIntegerOption(option =>
      option
        .setRequired(false)
        .setName("times")
        .setDescription("sob a certain amount of times"))
    .addChannelOption(option =>
      option
        .setRequired(false)
        .setName("channel")
        .setDescription("sob in this channel")),
  async execute(int) {
    // sob command
    const type = int.options.getString("type") || ":sob:"
    const timesto = int.options.getInteger("times") || 1;
    const channel = int.client.channels.cache.get("1062333691541606432");
    const channelop = int.options.getChannel("channel");
    if (channelop) {
      if (channelop === "1044857131926564945" || channelop === "1044554861687099433" || channelop === "1044554031139405844" || channelop === "1044857131926564945") {
        if (int.member.hasPermission("ADMINISTRATOR") === "true") {
          ;
        } else {
          return int.reply({ content: 'You do not have permission to sob there :sob:', ephemeral: true })
        }
      }
    }
    channel.send(int.user.username + ' sobbed: ' + Date.now() + ', for ' + timesto + ' times in ' + int.channel.name + ' (<#' + int.channel.id + '>)');
    if (timesto > 1) {
      await int.reply({ content: "sobbed " + timesto + " times with type: " + type, ephemeral: true });
    } else {
      await int.reply({ content: "sobbed " + timesto + " time with type: " + type, ephemeral: true });
    }
    for (let i = 0; i < timesto; i++) {
      if (channelop) {
        await channelop.send(type)
      } else {
        int.channel.send(type)
      }
    }
    log("CMD-LOG", `${int.user.username} sobbed ${timesto} times`);
  }
};