require("dotenv").config();
const fs = require("fs");
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

console.log("Bot starting...");

// ======================
// memory system
// ======================

const memoryFile = "./memory/chatHistory.json";

function loadMemory() {
  try {
    return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
  } catch {
    return [];
  }
}

function saveMemory(data) {
  fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

function addMemory(text) {
  const mem = loadMemory();
  mem.push({ text, time: Date.now() });
  saveMemory(mem.slice(-50));
}

// ======================
// 招待チャンネル
// ======================

const inviteChannels = [
  "1506605319357464659",
  "1506605435082375219",
  "1506605496730128565",
  "1506605706093138123",
  "1506605768286277712",
  "1506605819439874058"
];

// ======================
// 固定フレーズ
// ======================

const fixedPhrases = {
  "こんにちは": ["やっほー☕", "こんにちは！"],
  "おはよう": ["おはよう☀️"],
  "こんばんは": ["こんばんは🌙"],
  "ありがとう": ["どういたしまして☕"],
  "なんか話題ない？": ["最近音楽どう？", "作曲進んでる？"]
};

// ======================
// 起動
// ======================

client.once("clientReady", () => {
  console.log(`${client.user.tag} 起動完了☕`);
});

// ======================
// メイン処理
// ======================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;

  console.log("受信:", text);

  // ======================
  // ① 招待チャンネル制御（最優先）
  // ======================

  if (inviteChannels.includes(message.channel.id)) {

    if (
      message.member?.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) return;

    if (message.mentions.users.size === 0) {

      try {
        await message.delete();

        await message.author.send(
          "⚠️ 招待チャンネルではメンション付きのみ送信できます。\n" +
          "⚠️ Only mentions are allowed in invite channels."
        );

        console.log("招待メッセージ削除");
      } catch (err) {
        console.log("削除失敗:", err.message);
      }

      return;
    }
  }

  // ======================
  // ② 記憶保存
  // ======================

  addMemory(text);

  const memory = loadMemory();
  const last = memory[memory.length - 2];

  // ======================
  // ③ !ai
  // ======================

  if (text.startsWith("!ai")) {

    let input = text.replace("!ai", "").trim();

    // ======================
    // 固定フレーズ優先
    // ======================

    if (fixedPhrases[input]) {
      const list = fixedPhrases[input];
      return message.reply(
        list[Math.floor(Math.random() * list.length)]
      );
    }

    let reply = "";

    // ======================
    // 記憶呼び出し
    // ======================

    const memoryWords = ["それ", "前", "さっき", "続き"];

    if (
      last &&
      memoryWords.some(w => input.includes(w))
    ) {
      reply += `さっきの「${last.text}」の続きかな？ `;
    }

    // ======================
    // シンプル反応
    // ======================

    if (input.includes("眠い")) {
      reply += "ちゃんと休んで🥲";
    } else if (input.includes("疲れ")) {
      reply += "無理しないで";
    } else {
      const random = [
        "気になる笑",
        "もう少し詳しく聞きたい",
        "続きありそう",
        "それ面白いね"
      ];

      reply += random[Math.floor(Math.random() * random.length)];
    }

    return message.reply(reply);
  }

  // ======================
  // ④ 軽いリアクション
  // ======================

  if (
    text.includes("こんにちは") ||
    text.includes("やっほ")
  ) {
    return message.reply("やっほー☕");
  }
});

// ======================
// login
// ======================

client.login(process.env.DISCORD_TOKEN);