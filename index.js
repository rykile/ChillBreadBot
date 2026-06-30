const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  REST,
  Routes,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = require("./config");

// =========================
// Client
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// =========================
// コマンド読み込み
// =========================

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// =========================
// Slash Commands
// =========================

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    console.log(`実行コマンド: ${interaction.commandName}`);

    await command.execute(interaction);

    console.log("実行成功");
  } catch (err) {
    console.error(err);

    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: "❌ エラーが発生しました。",
          flags: MessageFlags.Ephemeral,
        });
      } catch {}
    }
  }
});

// =========================
// 招待チャンネル保護
// =========================

client.on(Events.MessageCreate, async (message) => {
  // Botは無視
  if (message.author.bot) return;

  // DMは無視
  if (!message.guild) return;

  // 対象チャンネル以外は無視
  if (!config.INVITE_CHANNEL_IDS.includes(message.channel.id)) return;

  // メンション付きは許可
  if (message.mentions.users.size > 0) return;

  // 管理者は許可
  if (
    message.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  ) {
    return;
  }

  try {
    // ユーザーのメッセージ削除
    await message.delete();

    // 注意メッセージ送信
    const warn = await message.channel.send({
      content:
        `❌ **このチャンネルでは通常メッセージは送信できません。**\n` +
        `💬 メンション付きメッセージのみ可能です。`,
    });

    // 5秒後に削除
    setTimeout(async () => {
      try {
        await warn.delete();
      } catch {}
    }, 5000);
  } catch (err) {
    console.error("MessageDelete Error:", err);
  }
});
// =========================
// 起動ログ
// =========================

client.once(Events.ClientReady, (clientUser) => {
  console.log(`✅ Logged in as ${clientUser.user.tag}`);
});

// =========================
// コマンド登録
// =========================

async function registerCommands() {
  const commands = [];

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN
  );

  console.log("📥 コマンド登録中...");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    {
      body: commands,
    }
  );

  console.log("✅ コマンド登録完了");
}

// =========================
// Bot起動
// =========================

(async () => {
  try {
    await registerCommands();

    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ 起動エラー:", err);
  }
})();