// ===== dotenv =====
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// 招待チャンネル
const inviteChannels = [
 "1506605319357464659",
 "1506605435082375219",
 "1506605496730128565",
 "1506605706093138123",
 "1506605768286277712",
 "1506605819439874058"
];

// 単語認識辞書
const words = {

  音楽:{
    type:"topic",
    reply:[
      "音楽の話きた🎵",
      "音楽いいね〜",
      "曲作り気になる"
    ]
  },

  韓国語:{
    type:"language",
    reply:[
      "韓国語いいね🇰🇷",
      "韓国語勉強してるの？",
      "発音むずいよね笑"
    ]
  },

  学校:{
    type:"life",
    reply:[
      "学校どうだった？",
      "学校お疲れ☕"
    ]
  },

  疲れた:{
    type:"emotion",
    reply:[
      "ちゃんと休んで🥲",
      "無理しすぎ注意"
    ]
  },

  楽しい:{
    type:"emotion",
    reply:[
      "それは良かった！",
      "楽しそう笑"
    ]
  }

};

client.once(
"ready",
()=>{

console.log(
`${client.user.tag}
起動完了☕`
);

});

client.on(
"messageCreate",
async(message)=>{

if(message.author.bot)
return;

const msg=
message.content;

const lower=
msg.toLowerCase();

// 招待欄制御

if(
inviteChannels.includes(
message.channel.id
)
){

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

}catch{

}

return;

}

// AI

if(
lower.startsWith(
"!ai"
)
){

const text=
msg.replace(
"!ai",
""
).trim();

if(!text){

return message.reply(
"☕ 話しかけて〜"
);

}

let responses=[];

for(
const word
in words
){

if(
text.includes(
word
)
){

responses.push(

words[word]
.reply[
Math.floor(
Math.random()
*
words[word]
.reply.length
)
]

);

}

}

if(
responses.length===0
){

responses.push(

`☕ "${text}"気になる...`

);

}

return message.reply(

responses.join(
" / "
)

);

}

// 挨拶

if(
lower.includes(
"こんにちは"
)
||
lower.includes(
"やっほ"
)
){

return message.reply(
"☕ やっほー！"
);

}

});

client.login(
process.env.DISCORD_TOKEN
);