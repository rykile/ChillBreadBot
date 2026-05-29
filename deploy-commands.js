{\rtf1\ansi\ansicpg932\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const \{ REST, Routes \} = require("discord.js");\
const fs = require("fs");\
require("dotenv").config();\
\
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));\
\
const commands = [];\
\
for (const file of commandFiles) \{\
  const command = require(`./commands/$\{file\}`);\
  commands.push(command.data.toJSON());\
\}\
\
const rest = new REST(\{ version: "10" \}).setToken(process.env.TOKEN);\
\
(async () => \{\
  try \{\
    console.log("\uc0\u12467 \u12510 \u12531 \u12489 \u30331 \u37682 \u20013 ...");\
\
    await rest.put(\
      Routes.applicationCommands(process.env.CLIENT_ID),\
      \{ body: commands \}\
    );\
\
    console.log("\uc0\u12467 \u12510 \u12531 \u12489 \u30331 \u37682 \u23436 \u20102 ");\
  \} catch (err) \{\
    console.error(err);\
  \}\
\})();}