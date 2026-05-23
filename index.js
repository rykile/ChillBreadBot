require("dotenv").config();
const fs=require("fs");
const {fetch}=require("undici");

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

// ======================
// memory
// ======================

function loadMemory(){

try{

return JSON.parse(
fs.readFileSync(
"./memory/chatHistory.json",
"utf8"
)

);

}catch{

return [];

}

}

function saveMemory(data){

fs.writeFileSync(

"./memory/chatHistory.json",

JSON.stringify(
data,
null,
2
)

);

}

function addMemory(text){

const mem=
loadMemory();

mem.push({

text,
time:Date.now()

});

saveMemory(
mem.slice(-50)
);

}

// ======================
// personality
// ======================

function loadPersonality(){

try{

return JSON.parse(

fs.readFileSync(
"./memory/personality.json",
"utf8"
)

);

}catch{

return{

favoriteTopics:{}

};

}

}

function savePersonality(data){

fs.writeFileSync(

"./memory/personality.json",

JSON.stringify(
data,
null,
2
)

);

}

// ======================
// 固定会話
// ======================

const fixedPhrases={

"こんにちは":{

reply:[

"やっほー☕",
"こんにちは！",
"来てくれてありがとう☕"

]

},

"おはよう":{

reply:[

"おはよう☀️",
"朝早いね笑"

]

},

"こんばんは":{

reply:[

"こんばんは🌙",
"夜だね"

]

},

"おやすみ":{

reply:[

"ちゃんと休んで😴",
"おやすみ〜"

]

},

"ありがとう":{

reply:[

"どういたしまして☕",
"いつでも！"

]

},

"なんか話題ない？":{

reply:[

"最近音楽どう？",

"韓国語最近どう？",

"最近作曲進んでる？"

]

}

};

// ======================
// 活用
// ======================

const normalizeWords={

"作った":"作る",
"作ってる":"作る",

"勉強してる":"勉強する",

"疲れてる":"疲れた",

"楽しかった":"楽しい"

};

function normalizeText(text){

let result=text;

for(
const key
in normalizeWords
){

result=
result.replaceAll(
key,
normalizeWords[key]
);

}

return result;

}

// ======================
// 助詞
// ======================

function analyzeParticles(text){

const result={};

const particles=[

"は",
"が",
"を",
"に",
"で",
"へ",
"と"

];

for(
const p
of particles
){

const regex=
new RegExp(
`(.+?)${p}(.+)`
);

const match=
text.match(regex);

if(
match
){

if(
match[1]==="こんにち"
) continue;

result[p]={

before:
match[1].trim(),

after:
match[2].trim()

};

}

}

return result;

}

// ======================
// web
// ======================

async function searchWeb(query){

try{

const response=
await fetch(

`https://api.duckduckgo.com/?q=${
encodeURIComponent(query)
}&format=json`

);

const data=
await response.json();

return(

data.AbstractText||
data.Heading||
null

);

}catch{

return null;

}

}

// ======================
// 招待チャンネル
// ======================

const inviteChannels=[

"1506605319357464659",
"1506605435082375219",
"1506605496730128565",
"1506605706093138123",
"1506605768286277712",
"1506605819439874058"

];

// ======================
// 起動
// ======================

client.once(
"clientReady",
()=>{

console.log(
`${client.user.tag} 起動完了☕`
);

}
);

process.on(
"unhandledRejection",
console.error
);

process.on(
"uncaughtException",
console.error
);

// ======================
// main
// ======================

client.on(
"messageCreate",

async(message)=>{

console.log(
"受信:",
message.content
);

if(
message.author.bot
)return;

const text=
message.content;

// 招待欄

if(
inviteChannels.includes(
message.channel.id
)
){

if(

message.member
?.permissions.has(
PermissionsBitField.Flags.Administrator
)

)return;

if(
message.mentions.users.size===0
){

try{

await message.delete();

await message.author.send(

"⚠️ 招待チャンネルではメンション付きのみ送信できます。\n"+
"⚠️ In invite channels, only messages with mentions are allowed."

);

console.log(
"削除成功"
);

}catch(err){

console.log(
"削除エラー:",
err
);

}

return;

}

}

// 記憶

addMemory(text);

const memory=
loadMemory();

const last=
memory[
memory.length-2
];

// AI

if(
text.startsWith("!ai")
){

let input=
text.replace(
"!ai",
""
).trim();

input=
normalizeText(
input);

// 固定会話優先

if(
fixedPhrases[input]
){

const list=
fixedPhrases[input].reply;

return message.reply(

list[
Math.floor(
Math.random()*
list.length
)

]

);

}

const grammar=
analyzeParticles(
input
);

const p=
loadPersonality();

input
.split(/\s+/)
.forEach(word=>{

if(
word.length<2
)return;

if(
!p.favoriteTopics[word]
){

p.favoriteTopics[word]=0;

}

p.favoriteTopics[word]++;

});

savePersonality(
p
);

let reply="";

// 記憶

const memoryWords=[

"それ",
"前",
"さっき",
"続き",
"また"

];

const useMemory=

memoryWords.some(
w=>
input.includes(w)
);

if(
last &&
useMemory
){

reply+=
`さっきの「${last.text}」の続き？ `;

}

// 助詞

if(grammar["は"]){

reply+=
`${grammar["は"].before}の話かな。 `;

}

if(grammar["で"]){

reply+=
`${grammar["で"].before}が場所っぽいね。 `;

}

if(grammar["を"]){

reply+=
`${grammar["を"].before}が対象かな。 `;

}

// 会話

if(
input.includes("眠い")
){

reply+="ちゃんと休んで🥲";

}else{

const web=
await searchWeb(
input
);

if(
web
){

reply+=
`少し調べたけど ${web}`;

}else{

const random=[

"気になる笑",

"詳しく聞きたい",

"どうなった？",

"続きありそう"

];

reply+=

random[
Math.floor(
Math.random()*
random.length
)

];

}

}

return message.reply(
reply
);

}

}
);

client.login(
process.env.DISCORD_TOKEN);