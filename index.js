// ===== dotenv =====
require("dotenv").config();

// ===== Discord =====
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

// ===== Bot =====
const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== 招待チャンネル =====
const inviteChannels = [
  "1506605319357464659",
  "1506605435082375219",
  "1506605496730128565",
  "1506605706093138123",
  "1506605768286277712",
  "1506605819439874058"
];

// ===== 起動 =====
client.once("clientReady", () => {
  console.log(`${client.user.tag} 起動完了`);
});

// ===== メッセージ =====
client.on("messageCreate", async(message)=>{

  if(message.author.bot) return;

  const msg =
  message.content.toLowerCase();

  // ===== AI風会話 =====
  if(message.content.startsWith("!ai")){

    const userMsg =
    message.content
    .replace("!ai","")
    .trim();

    if(!userMsg){

      return message.reply(
        "☕ なんか話して〜"
      );

    }

    const reacts = [
      "おーそれ",
      "なるほど",
      "ちょい分かる",
      "いい話きた",
      "それ面白いな"
    ];

    const react =
    reacts[
      Math.floor(
        Math.random()*reacts.length
      )
    ];

    let topic="default";

    if(
      msg.includes("音楽") ||
      msg.includes("曲")
    ){
      topic="music";
    }

    else if(
      msg.includes("韓国")
    ){
      topic="korea";
    }

    else if(
      msg.includes("眠") ||
      msg.includes("疲")
    ){
      topic="life";
    }

    const replies={

      music:[
        "どんな曲作ってる？",
        "最近好きな音ある？",
        "ジャンル気になる"
      ],

      korea:[
        "文化？言語？",
        "韓国語興味ある感じ？",
        "K-POP聞く？"
      ],

      life:[
        "最近疲れてる？",
        "無理しすぎ注意ね",
        "ちゃんと休めてる？"
      ],

      default:[
        "もう少し聞きたい",
        "それどういう流れ？",
        "詳しく教えて"
      ]

    };

    const list=replies[topic];

    const reply=
    list[
      Math.floor(
        Math.random()*list.length
      )
    ];

    return message.reply(
      `☕ ${react}。${reply}`
    );

  }

  // ===== 普通会話 =====

  if(
    msg.includes("こんにちは")||
    msg.includes("やっほ")
  ){

    return message.reply(
      "やっほー！☕"
    );

  }

});

// ===== ログイン =====
client.login(
  process.env.DISCORD_TOKEN
);