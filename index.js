const {
Client,
GatewayIntentBits,
Collection,
Events,
REST,
Routes,
} = require(“discord.js”);

const fs = require(“fs”);
const path = require(“path”);
require(“dotenv”).config();

const config = require(”./config”);

// =========================
// ■ Client
// =========================
const client = new Client({
intents: [
GatewayIntentBits.Guilds,
],
});

client.commands = new Collection();

// =========================
// ■ コマンド読み込み
// =========================
const commandsPath = path.join(__dirname, “commands”);
const commandFiles = fs
.readdirSync(commandsPath)
.filter(file => file.endsWith(”.js”));

for (const file of commandFiles) {
try {
const command = require(./commands/${file});

if (!command.data || !command.execute) {
  console.log(`⚠️ ${file} は command.data または execute がありません`);
  continue;
}
client.commands.set(command.data.name, command);
console.log(`✅ 読み込み: ${command.data.name}`);

} catch (err) {
console.error(❌ ${file} 読み込み失敗);
console.error(err);
}
}

// =========================
// ■ Interaction管理
// =========================
client.on(Events.InteractionCreate, async interaction => {
try {
if (interaction.isChatInputCommand()) {
const command = client.commands.get(
interaction.commandName
);

  if (!command) return;
  await command.execute(interaction);
  return;
}
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

if (!interaction.replied && !interaction.deferred) {
  await interaction.reply({
    content: "エラーが発生しました。",
    ephemeral: true,
  });
}

}
});

// =========================
// ■ 起動ログ
// =========================
client.once(Events.ClientReady, c => {
console.log(Logged in as ${c.user.tag});
console.log(
“読み込みコマンド:”,
[…client.commands.keys()]
);
});

// =========================
// ■ コマンド登録
// =========================
async function registerCommands() {
const commands = [];

for (const file of commandFiles) {
try {
const command = require(./commands/${file});

  if (!command.data) continue;
  commands.push(command.data.toJSON());
} catch (err) {
  console.error(
    `❌ ${file} 登録用読み込み失敗`
  );
  console.error(err);
}

}

console.log(
“登録コマンド:”,
commands.map(cmd => cmd.name)
);

const rest = new REST({ version: “10” })
.setToken(process.env.TOKEN);

console.log(“コマンド登録中…”);

await rest.put(
Routes.applicationGuildCommands(
process.env.CLIENT_ID,
process.env.GUILD_ID
),
{ body: commands }
);

console.log(“コマンド登録完了”);
}

// =========================
// ■ 起動
// =========================
(async () => {
try {
await registerCommands();
await client.login(process.env.TOKEN);
} catch (err) {
console.error(err);
}
})();