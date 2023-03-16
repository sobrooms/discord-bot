const { EmbedBuilder, SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus, joinVoiceChannel } = require('@discordjs/voice');
const log = require('../util/log');
const url = undefined;
const playingAudioFile = false;
const audioResource = undefined;
const player = undefined;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("play music on a voice channel")
    .addSubcommand(sbc => sbc.setName("play").setDescription("play music on the current voice channel").addStringOption(opt => opt.setName("link").setDescription("music link to play").setRequired(true)).addChannelOption(opt => opt.setName("voice_channel").setDescription("voice channel to play music on").setRequired(true).addChannelTypes(ChannelType.GuildVoice))),
  async execute(interaction) {
    const playingEmbedRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('leavecurvc')
					.setLabel('❌ Leave channel')
					.setStyle(ButtonStyle.Danger),
			);
    const leaveFilter = i => i.customId === 'leavecurvc' && i.user.id === interaction.user.id;
    const leaveCollector = interaction.channel.createMessageComponentCollector({ leaveFilter });
    leaveCollector.on('collect', async i => {
	   if (player) {
       player?.stop();
     }
    });
    const subcommand = interaction.options.getSubcommand();
    const playChannel = interaction.options.getChannel("voice_channel")
    if (subcommand == "play") {
      playingAudioFile = "try"
      url = interaction.options.getString("link")
      const playStatus = interaction.reply(`Attempting to play: ${url}...`)
      player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
      })
      audioResource = createAudioResource(url, {
        metadata: {
          title: ''
        }
      });
      joinVoiceChannel({
        channelId: playChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })
      player.play(audioResource)
      player.on(AudioPlayerStatus.Buffering, function () {
        playingAudioFile = "buffering"
      })
      player.on(AudioPlayerStatus.Playing, function() {
        playingAudioFile = true
      })
      const PlayingEmbed = new EmbedBuilder()
        .setTitle(`Playing music in ${playChannel}`)
        .setDescription(`Playingn with audio: ${url}`);
      player.on(AudioPlayerStatus.Playing, function() {
         interaction.editReply({ content: "", embeds: [PlayingEmbed], components: [playingEmbedRow] })
      })
      player.on(AudioPlayerStatus.Idle, function() {
        interaction.editReply("Done playing audio or the bot had an internal error while trying to play the music file...")
      })
      player.on('error', function (err) {
        if (err) {
          log('CMD-LOG.music.back', `Error on music player: ${err}`, false, true);
          return interaction.followUp(`Failed to play audio provided: ${url}`)
        }
      })
    }
  }
}