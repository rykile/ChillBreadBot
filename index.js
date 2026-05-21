// ===== dotenv =====
require("dotenv").config();

const {
Client,
GatewayIntentBits,
PermissionsBitField
}=require("discord.js");

const client=new Client({

intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.DirectMessages
]

});

const inviteChannels=[

"1506605319357464659",
"1506605435082375219",
"1506605496730128565",
"1506605706093138123",
"1506605768286277712",
"1506605819439874058"

];

// 助詞込み→正規化

const normalize={

"僕が":"僕",
"僕は":"僕",
"僕を":"僕",
"僕に":"僕",
"僕の":"僕",

"私が":"私",
"私は":"私",
"私を":"私",

"学校で":"学校",
"家で":"家",

"音楽を":"音楽",
"韓国語を":"韓国語",
"ゲームを":"ゲーム",

"作った":"作る",
"勉強してる":"勉強",
"やってる":"する",

"楽しかった":"楽しい",
"疲れてる":"疲れた"

};

// 単語辞書

const dictionary={

"僕":{
type:"S",
value:"RYK!LE"
},

"私":{
type:"S",
value:"ユーザー"
},

"今日":{
type:"time",
value:"今日"
},

"昨日":{
type:"time",
value:"昨日"
},

"学校":{
type:"place",
value:"学校"
},

"家":{
type:"place",
value:"家"
},

"音楽":{
type:"O",
value:"音楽"
},

"韓国語":{
type:"O",
value:"韓国語"
},

"ゲーム":{
type:"O",
value:"ゲーム"
},

"友達":{
type:"O",
value:"友達"
},

"作る":{
type:"V"
},

"勉強":{
type:"V"
},

"好き":{
type:"V"
},

"する":{
type:"V"
},

"楽しい":{
type:"emotion",
reply:[
"楽しそう🔥",
"いいね！"
]
},

"疲れた":{
type:"emotion",
reply:[
"無理しないで🥲",
"休憩大事"
]
},

"眠い":{
type:"emotion",
reply:[
"寝よう🤣",
"それは眠いやつ笑"
]
},

"やばい":{
reply:[
"何があった🤣",
"気になる笑"
]
}

};

client.once("ready",()=>{

console.log(
`${client.user.tag} 起動完了☕`
);

});

client.on(
"messageCreate",
async(message)=>{

if(message.author.bot)return;

const lower=
message.content.toLowerCase();


// 招待欄

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
)return;

if(
message.mentions
.users.size>0
)return;

try{

await message.delete();

await message.author.send(
"⚠️ 招待欄ではメンション付きのみ！"
);

}catch{}

return;

}


// AI

if(
lower.startsWith("!ai")
){

let text=
message.content
.replace(
"!ai",
""
)
.trim();

for(
const key
in normalize
){

text=
text.replaceAll(
key,
normalize[key]
);

}

let S="";
let O="";
let V="";
let place="";
let time="";
let reactions=[];

for(
const word
in dictionary
){

if(
text.includes(word)
){

const item=
dictionary[word];

if(item.type==="S")
S=item.value;

if(item.type==="O")
O=item.value;

if(item.type==="V")
V=word;

if(item.type==="place")
place=item.value;

if(item.type==="time")
time=item.value;

if(
item.reply
){

reactions.push(

item.reply[
Math.floor(
Math.random()*
item.reply.length
)
]

);

}

}

}

let reply="☕ ";

if(
S||O||V
){

reply+=
`${S}${time}${place}${O}${V}なんだね！ `;

}

if(
reactions.length
){

reply+=
reactions.join(" ");

}

if(
reply==="☕ "
){

reply=
`☕ "${text}"気になる`;

}

return message.reply(
reply
);

}

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