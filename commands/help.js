const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("コマンド一覧を表示"),

  async execute(interaction) {
    await interaction.reply({
      content:
`📖 Chill Bread Bot コマンド一覧

/ping
→ Botの応答確認

/help
→ このヘルプを表示`,
      ephemeral: true,
    });
  },
};