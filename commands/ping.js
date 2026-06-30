const {
  SlashCommandBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botの応答を確認します。"),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;

    await interaction.reply({
      content:
`🏓 Pong!

🤖 Botは正常に動作しています。

⏱️ 応答速度: **${latency}ms**`,
      flags: MessageFlags.Ephemeral,
    });
  },
};