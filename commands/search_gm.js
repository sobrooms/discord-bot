const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { searchGM, getImage, commandsName } = require("./GM/search.js")
const Path_GM_Handbook = require("../config.json").gmh
const fs = require('fs');
const readline = require('readline');

module.exports = {
  description: "searches for an item in the GM Handbook",
  usage: "</search_gm:0> **<search (query, type: string)>** *<OPTIONAL: category (name, type: string)>* *<OPTIONAL: match_result (true/false, type: boolean)>*\nExample: </search_gm:0> *search*: **Sob** *category:* *items* *match_option:* **True**",
  hidden: false,
  data: new SlashCommandBuilder()
    .setName("search_gm")
    .setDescription("Search for an item in the Grasscutter handbook")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("The item ID/name to search for")
        .setRequired(true)
        .setAutocomplete(true))
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category of what the returned result should be')
        .setRequired(false)
        .addChoices(
          {
            name: 'avatars',
            value: 'avatars',
          },
          {
            name: 'quests',
            value: 'quest',
          },
          {
            name: 'items',
            value: 'items',
          },
          {
            name: 'monsters/enemies',
            value: 'monsters',
          },
          {
            name: 'scenes',
            value: 'scenes',
          },
          {
            name: 'gadgets',
            value: 'gadgets',
          }
        ))
    .addBooleanOption(option =>
      option
        .setName('match_result')
        .setDescription('If the result should match the search query')
        .setRequired(false)),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [];
    const fileStream = fs.createReadStream(`${Path_GM_Handbook.Path}/${Path_GM_Handbook.If_Choices_is_Null}`);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    if (focusedValue.length < 1) {
      return interaction.respond([{
        name: "Please enter an item name or ID",
        value: "Please enter an item or ID"
      }])
    } else {
      for await (const line of rl) {
        if (line.startsWith("//")) {
          category = line.replace("//", "").replace(" ", "");
        }
        let regex = new RegExp(`${focusedValue.replace(/[\(\)\[\]\{\}]/g, '\\$&')}`, 'i');
        let result = line.match(regex);
        if (result) {
          try {
            choices.push({
              name: result.input.split(":")[1].trim().slice(0, 80) + " | (" + category + ")" || "Not Found",
              value: result.input.split(":")[1].trim() || "Item not found"
            })
          } catch (error) {
            choices.push({
              name: "Item not found",
              value: "Item not found"
            })
          }
        }
      }
    }
    interaction.respond(choices.slice(0, 25));
  },
  async execute(interaction) {
    try {
      // getting the given string from interaction.options 
      const search = interaction.options.getString('search');
      const category = interaction.options.getString('category');
      const log = require('../util/log');
      log("CMD-LOG", `${interaction.user.username} searched in the handbook: ${search}`)
      // getting the given boolean value from interaction.options 
      const match = interaction.options.getBoolean('match_result');
      // Check if user is blocked from using the command
      // deferring the reply ensuring the reply fetched
      await interaction.deferReply({ fetchReply: true })
      // getting the search result using the given search string, category and match
      const searchResult = await searchGM(search, category, match);
      // get the image using the result of search
      const image = await getImage(searchResult.name, searchResult.category);
      // get the commands with GC
      const commands = commandsName(searchResult.category, searchResult.id, "GC");
      // check if the search result is not found
      if (searchResult.id === "Not found" && searchResult.name === "Item not found" && searchResult.category === "Item") {
        // creating the new embed builder
        const embed = new EmbedBuilder()
          // set title for the embed
          .setTitle('Search result')
          // set description for the embed
          .setDescription('Could not find an item with the name: "' + search + '"')
          // set color for the embed
          .setColor('Red')
          // set timestamp for the embed
          .setTimestamp(new Date())
          // set the footer of the embed
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
          });
        // edit the reply with the embed
        await interaction.editReply({ embeds: [embed] });
      } else if (searchResult.id === "Error" && searchResult.name === "Error" && searchResult.category === "Error") {
        const embed = new EmbedBuilder()
          .setTitle('Search result')
          .setDescription('Error occured while trying to find: ' + search)
          .setColor('Red')
          .setTimestamp(new Date())
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
          });
        await interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder();
        embed.setTitle('Search result')
        embed.setThumbnail(image)
        embed.setColor("#3240A8")
        embed.setTimestamp(new Date())
        embed.addFields({
          name: 'Search query',
          value: search
        })
        embed.addFields({
          name: 'Result',
          value: searchResult.name + ' - ' + searchResult.id,
          inline: true
        })
        embed.addFields({
          name: 'Result (ID)',
          value: searchResult.id,
          inline: true
        })
        embed.addFields({
          name: 'Result (Name)',
          value: searchResult.name,
          inline: true
        })
        embed.addFields({
          name: 'Item category',
          value: searchResult.category,
          inline: true
        })
        embed.setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL()
        });
        const button = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Grasscutter Commands')
              .setStyle(ButtonStyle.Primary)
              .setCustomId('commands_gc')
          )
        await interaction.editReply({ embeds: [embed], components: [button] });
        const filter = (i) => i.customId === "commands_gc" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        // button collector
        collector.on('collect', async (i) => {
          if (i.customId === 'commands_gc') {
            const embed_gc = new EmbedBuilder();
            embed_gc.setTitle("Grasscutter commands")
            embed_gc.setDescription(`List of commands for the${searchResult.category} category`)
            embed_gc.setThumbnail(image)
            embed_gc.setTimestamp()
            embed_gc.setColor("#3240A8")
            embed_gc.setFooter({
              text: `Requested by ${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL()
            });
            if (searchResult.category === " Avatars") {
              embed_gc.addFields({
                name: "Normal",
                value: commands.commands_1
              })
              embed_gc.addFields({
                name: "With level",
                value: commands.commands_2
              })
              embed_gc.addFields({
                name: "With constellation",
                value: commands.commands_3
              })
              embed_gc.addFields({
                name: "With level and constellation",
                value: commands.commands_4
              })
            } else if (searchResult.category === " Quests") {
              embed_gc.addFields({
                name: "Add this quest",
                value: commands.commands_1
              })
              embed_gc.addFields({
                name: "Remove this quest",
                value: commands.commands_2
              })
            } else if (searchResult.category === " Items") {
              embed_gc.addFields({
                name: "Normal",
                value: commands.commands_1
              })
              embed_gc.addFields({
                name: "Item amount",
                value: commands.commands_2
              })
              embed_gc.addFields({
                name: "Artifact",
                value: commands.commands_3
              })
              embed_gc.addFields({
                name: "Weapon",
                value: commands.commands_4
              })
            } else if (searchResult.category === " Monsters") {
              embed_gc.addFields({
                name: "Normal",
                value: commands.commands_1
              })
              embed_gc.addFields({
                name: "Amount",
                value: commands.commands_2
              })
              embed_gc.addFields({
                name: "Level and amount",
                value: commands.commands_3
              })
              embed_gc.addFields({
                name: "Level, amount, and HP",
                value: commands.commands_4
              })
            } else {
              embed_gc.addFields({
                name: "No commands available",
                value: "There are no Grasscutter commands available for this category"
              })
            }
            await interaction.editReply({
              content: null,
              components: [],
              embeds: [embed_gc],
            });
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}