const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const languagesFlags = {
  af: "🇿🇦 - Afrikaans",
  sq: "🇦🇱 - Albanian",
  am: "🇪🇹 - Amharic",
  ar: "🇸🇦 - Arabic",
  hy: "🇦🇲 - Armenian",
  az: "🇦🇿 - Azerbaijani",
  be: "🇧🇾 - Belarusian",
  bn: "🇧🇩 - Bengali",
  bs: "🇧🇦 - Bosnian",
  bg: "🇧🇬 - Bulgarian",
  ceb: "🇵🇭 - Cebuano",
  ny: "🇲🇼 - Chichewa",
  "zh-cn": "🇨🇳 - Chinese",
  "zh-tw": "🇹🇼 - Taiwanese Mandarin",
  hr: "🇭🇷 - Croatian",
  cs: "🇨🇿 - Czech",
  da: "🇩🇰 - Danish",
  nl: "🇳🇱 - Dutch",
  en: "🇺🇸 - English",
  et: "🇪🇪 - Estonian",
  tl: "🇵🇭 - Tagalog",
  fil: ":flag_ph: - Filipino",
  fi: "🇫🇮 - Finnish",
  fr: "🇫🇷 - French",
  ka: "🇬🇪 - Georgian",
  de: "🇩🇪 - German",
  el: "🇬🇷 - Greek (modern)",
  ht: "🇭🇹 - Haitian",
  ha: "🇳🇬 - Hausan",
  iw: "🇮🇱 - Hebrew",
  hi: "🇮🇳 - Hindi",
  hmn: "🇨🇳 - Hmong",
  hu: "🇭🇺 - Hungarian",
  is: "🇮🇸 - Icelandic",
  id: "🇮🇩 - Indonesian",
  ga: "🇮🇪 - Irish",
  it: "🇮🇹 - Italian",
  ja: "🇯🇵 - Japanese",
  jw: "🇮🇩 - Javanese",
  kk: "🇰🇿 - Kazakh",
  km: "🇰🇭 - Khmer",
  ko: "🇰🇷 - Korean",
  ku: "🇮🇷 - Kurdish",
  ky: "🇰🇬 - Kyrgyz",
  lo: "🇱🇦 - Lao",
  la: "🇻🇦 - Latin",
  lv: "🇱🇻 - Latvian",
  lt: "🇱🇹 - Lithuanian",
  lb: "🇱🇺 - Luxembourgish/Letzeburgesch",
  mk: "🇲🇰 - Macedonian",
  mg: "🇲🇬 - Madagascar",
  ms: "🇲🇾 - Malay",
  ml: "🇮🇳 - Malayalam",
  mt: "🇲🇹 - Maltese",
  mi: "🇳🇿 - Maori",
  mr: "🇮🇳 - Marathi",
  mn: "🇲🇳 - Mongolian",
  my: "🇲🇲 - Burmese",
  ne: "🇳🇵 - Nepali",
  no: "🇳🇴 - Norwegian",
  ps: "🇦🇫 - Pashto",
  fa: "🇮🇷 - Persian",
  pl: "🇵🇱 - Polish",
  pt: "🇵🇹 - Portuguese",
  pa: "🇮🇳 - Punjabi",
  ro: "🇷🇴 - Romanian",
  ru: "🇷🇺 - Russian",
  sm: "🇼🇸 - Samoan",
  sr: "🇷🇸 - Serbian",
  st: "🇿🇦 - Southern Sotho",
  sn: "🇿🇼 - Shona",
  si: "🇱🇰 - Sinhalese",
  sk: "🇸🇰 - Slovak",
  sl: "🇸🇮 - Slovenian",
  so: "🇸🇴 - Somali",
  es: "🇪🇸 - Spanish",
  sw: "🇰🇪 - Swahili",
  sv: "🇸🇪 - Swedish",
  tg: "🇹🇯 - Tajik",
  ta: "🇮🇳 - Tamil",
  te: "🇮🇳 - Telugu",
  th: "🇹🇭 - Thai",
  tr: "🇹🇷 - Turkish",
  uk: "🇺🇦 - Ukranian",
  ur: "🇵🇰 - Urdu",
  uz: "🇺🇿 - Uzbek",
  vi: "🇻🇳 - Vietnamese",
  cy: "🇬🇧 - Welsh",
  xh: "🇿🇦 - Xhosa",
  yi: "🇮🇱 - Yiddish",
  yo: "🇳🇬 - Yoruba",
  zu: "🇿🇦 - Zulu",
};
module.exports = {
  description: 'Translate a word, sentence, whatever',
  usage: '</translate:0> **<language (to translate to, type: string, choices list)>** **<text (to translate, type: string)>**',
  hidden: false,
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate words")
    .addStringOption(option =>
      option.setName("language").setDescription("Language to translate to").setRequired(true).addChoices(
        { name: 'English', value: 'en' },
        { name: 'Filipino', value: 'fil' },
        { name: 'Portuguese', value: 'pt' },
        { name: 'Arabic', value: 'ar' },
        { name: 'French', value: 'fr' },
        { name: 'Japanese', value: 'ja' },
        { name: 'Chinese', value: 'zh-cn' },
        { name: 'Taiwanese Mandarin', value: 'zh-tw' },
        { name: 'Thai', value: 'th' },
        { name: 'Vietnamese', value: 'vi' },
        { name: 'Indonesian', value: 'id' },
        { name: 'Javanese', value: 'jw' },
        { name: 'Hebrew', value: 'iw' }
      ))
    .addStringOption(option =>
      option.setName("text").setDescription("Text to translate").setRequired(true)),
  async execute(i) {
    const textToTranslate = i.options.getString("text")
    const language = i.options.getString("language")
    const text = await axios.get("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + language + "&dt=t&dj=1&source=input&q=" + textToTranslate)
    const translated = text.data.sentences[0].trans;
    const srclang = text.data.src;
    const lgf = languagesFlags[srclang] || "<:thefeke138Idk:1036202813530837003> Unknown language";
    const lgc = languagesFlags[language] || "<:thefeke138Idk:1036202813530837003> Unknown language";
    const log = require('../util/log');
    if (!translated) return i.reply("no translation found");
    log("CMD-LOG", `${i.user.username} translated text: ${textToTranslate} to language ${language} and got result ${translated}`)
    const embed = new EmbedBuilder()
      .setTitle("Translate")
      .addFields({
        name: 'Text to translate',
        value: textToTranslate
      })
      .addFields({
        name: 'Result',
        value: translated
      })
      .addFields({
        name: 'Language (language code)',
        value: `${lgf} (Translate to ${lgc})`
      })
      .setFooter({
        text: `Requested by ${i.user.username}`,
        iconURL: i.user.displayAvatarURL(),
      })
      .setColor(require('../config.json').sobColor)
    return i.reply({ embeds: [embed] })
  }
}
