// ===== dotenv =====
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

// ======================
// memory
// ======================

function loadMemory() {
  try {
    return JSON.parse(fs.readFileSync("./memory/chatHistory.json", "utf8"));
  } catch {
    return [];
  }
}

function saveMemory(data) {
  fs.writeFileSync("./memory/chatHistory.json", JSON.stringify(data, null, 2));
}

function addMemory(text) {
  const mem = loadMemory();
  mem.push({ text, time: Date.now() });

  // 最新30だけ保持
  saveMemory(mem.slice(-30));
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
// 起動
// ======================

client.once("ready", () => {
  console.log(`${client.user.tag} 起動完了☕`);
});

// ======================
// メイン
// ======================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;

  // ======================
  // 記憶保存
  // ======================
  addMemory(text);

  const memory = loadMemory();
  const last = memory[memory.length - 2]; // 1つ前

  // ======================
  // 招待制御
  // ======================
  if (inviteChannels.includes(message.channel.id)) {
    if (message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    if (message.mentions.users.size > 0) return;

    try {
      await message.delete();
      await message.author.send(
        "⚠️ 招待チャンネルではメンション付きのみ送信できます。\n" +
        "⚠️ In invite channels, only messages with mentions are allowed."
      );
    } catch {}

    return;
  }

  // ======================
  // AI
  // ======================

  if (text.startsWith("!ai")) {
    const input = text.replace("!ai", "").trim();

    let reply = "";

    // ======================
    // 自然な記憶呼び出し
    // ======================

    if (last && Math.random() > 0.5) {
      if (
        input.includes("それ") ||
        input.includes("さっき") ||
        input.includes("前")
      ) {
        reply += `さっきの「${last.text}」の話だよね。 `;
      }
    }

    // ======================
    // 通常会話
    // ======================

    if (input.includes("こんにちは")) {
      reply += "やっほー☕";
    } else if (input.includes("ありがとう")) {
      reply += "どういたしまして。";
    } else if (input.includes("眠い")) {
      reply += "それはちゃんと休んだ方がいいやつ。";
    } else {
      reply += "うん、もう少し詳しく聞きたいかも。";
    }

    return message.reply(reply);
  }

  // ======================
  // 軽い反応
  // ======================

  if (text.includes("こんにちは") || text.includes("やっほ")) {
    return message.reply("やっほー☕");
  }
});

// ======================
// login
// ======================

client.login(process.env.DISCORD_TOKEN);