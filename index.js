const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  REST,
  Routes,
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
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

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

      await command.execute(interaction);
      return;
    }

    // ボタン（将来拡張用）
    if (interaction.isButton()) {
      if (interaction.customId === "ping") {
        return interaction.reply({
          content: "pong",
          ephemeral: true,
        });
      }
    }
  } catch (err) {
    console.error(err);

    if (interaction.replied || interaction.deferred) return;

    await interaction.reply({
      content: "エラーが発生しました",
      ephemeral: true,
    });
  }
});

// =========================
// ■ 起動ログ
// =========================
client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

// =========================
// ■ コマンド登録（自動）
// =========================
async function registerCommands() {
  const commands = [];

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  console.log("コマンド登録中...");

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("コマンド登録完了");
}

// =========================
// ■ 起動
// =========================
(async () => {
  await registerCommands();
  await client.login(process.env.TOKEN);
})();