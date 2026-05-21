// ===== dotenv =====
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

const { OpenAI } = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 招待チャンネルID
const inviteChannels = [
  "1506605319357464659",
  "1506605435082375219",
  "1506605496730128565",
  "1506605706093138123",
  "1506605768286277712",
  "1506605819439874058"
];

client.once("ready", () => {
  console.log(
    `${client.user.tag} 起動完了☕`
  );
});

client.on(
  "messageCreate",
  async(message)=>{

    if(message.author.bot)
      return;

    console.log(
      "チャンネルID:",
      message.channel.id
    );

    const msg =
    message.content
    .toLowerCase();

    // ===== 招待欄 =====

    if(
      inviteChannels.includes(
      message.channel.id
      )
    ){

      // 管理者通過
      if(
        message.member
        ?.permissions.has(
          PermissionsBitField
          .Flags
          .Administrator
        )
      ){
        return;
      }

      // メンションあり通過
      if(
        message.mentions
        .users.size>0
      ){
        return;
      }

      try{

        await message.delete();

        await message.author.send(
          "⚠️ 招待欄ではメンション付きのみ送信できます！"
        );

      }catch(error){

        console.log(
          "削除失敗:",
          error
        );

      }

      return;

    }

    // ===== AI =====

    if(
      message.content
      .startsWith("!ai")
    ){

      const userMsg=
      message.content
      .replace(
        "!ai",""
      )
      .trim();

      if(!userMsg){

        return message.reply(
          "☕ 何か話して〜"
        );

      }

      try{

        const completion =
        await openai.chat.completions.create({

          model:"gpt-4.1-mini",

          messages:[
            {
              role:"system",
              content:
              "あなたはChill Breadサーバーの優しくゆるいAIです。"
            },
            {
              role:"user",
              content:userMsg
            }
          ]

        });

        return message.reply(
          "☕ "+
          completion
          .choices[0]
          .message.content
        );

      }catch{

        return message.reply(
          "☕ 今ちょっと調子悪い..."
        );

      }

    }

    // ===== 挨拶 =====

    if(
      msg.includes("こんにちは")
      ||
      msg.includes("やっほ")
      ||
      msg.includes("こん")
    ){

      return message.reply(
        "☕ やっほー！"
      );

    }

});

client.login(
process.env.DISCORD_TOKEN
);