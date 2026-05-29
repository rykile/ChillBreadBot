{\rtf1\ansi\ansicpg932\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const \{\
  SlashCommandBuilder,\
  ActionRowBuilder,\
  ButtonBuilder,\
  ButtonStyle,\
\} = require("discord.js");\
\
const config = require("../config");\
\
function generateInviteUrl() \{\
  return `https://discord.com/oauth2/authorize?client_id=$\{process.env.CLIENT_ID\}&permissions=$\{config.permissions\}&scope=bot%20applications.commands`;\
\}\
\
module.exports = \{\
  data: new SlashCommandBuilder()\
    .setName("addbot")\
    .setDescription("Bot\uc0\u12434 \u23566 \u20837 \u12375 \u12414 \u12377 \u65288 \u25307 \u24453 \u12481 \u12515 \u12531 \u12493 \u12523 \u23554 \u29992 \u65289 "),\
\
  async execute(interaction) \{\
    // \uc0\u9632  \u12481 \u12515 \u12531 \u12493 \u12523 \u21046 \u24481 \
    if (interaction.channelId !== config.INVITE_CHANNEL_ID) \{\
      return interaction.reply(\{\
        content: "\uc0\u12371 \u12398 \u12467 \u12510 \u12531 \u12489 \u12399 \u25307 \u24453 \u12481 \u12515 \u12531 \u12493 \u12523 \u12391 \u12398 \u12415 \u20351 \u29992 \u12391 \u12365 \u12414 \u12377 ",\
        ephemeral: true,\
      \});\
    \}\
\
    const url = generateInviteUrl();\
\
    const row = new ActionRowBuilder().addComponents(\
      new ButtonBuilder()\
        .setLabel("\uc0\u55357 \u56960  Bot\u12434 \u36861 \u21152 ")\
        .setStyle(ButtonStyle.Link)\
        .setURL(url)\
    );\
\
    await interaction.reply(\{\
      content: "\uc0\u12371 \u12371 \u12363 \u12425 \u12527 \u12531 \u12479 \u12483 \u12503 \u12391 \u23566 \u20837 \u12391 \u12365 \u12414 \u12377 ",\
      components: [row],\
      ephemeral: true,\
    \});\
  \},\
\};}
