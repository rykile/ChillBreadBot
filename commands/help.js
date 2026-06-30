const {
  SlashCommandBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("コマンド一覧を表示します。"),

  async execute(interaction) {
    await interaction.reply({
      content: `# 📖 Chill Bread Bot コマンド一覧

🤖 **/addbot**
Botを導入するための招待ボタンを表示します。
（招待専用チャンネルのみ）

🏓 **/ping**
Botが正常に動作しているか確認します。

❓ **/help**
このヘルプを表示します。`,
      flags: MessageFlags.Ephemeral,
    });
  },
};