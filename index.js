const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  REST,
  Routes,
  MessageFlags,
} = require("discord.js");

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = require("./config");

// =========================
// ■ Client
// =========================
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// =========================
// ■ コマンド読み込み
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
// ■ Interaction管理
// =========================
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // スラッシュコマンド
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      console.log("実行コマンド:", interaction.commandName);

      await command.execute(interaction);

      console.log("実行成功");

      return;
    }

    // ボタン（将来拡張用）
    if (interaction.isButton()) {
      if (interaction.customId === "ping") {
        return interaction.reply({
          content: "pong",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  } catch (err) {
    console.error(err);

    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: "エラーが発生しました。",
          flags: MessageFlags.Ephemeral,
        });
      } catch (replyError) {
        console.error("返信エラー:", replyError);
      }
    }
  }
});

// =========================
// ■ 起動ログ
// =========================
client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

// =========================
// ■ コマンド登録（ギルド）
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

  console.log("コマンド登録中...");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    {
      body: commands,
    }
  );

  console.log("コマンド登録完了");
}

// =========================
// ■ 起動
// =========================
(async () => {
  try {
    await registerCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("起動エラー:", err);
  }
})();
