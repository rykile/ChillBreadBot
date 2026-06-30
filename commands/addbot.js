const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");

const config = require("../config");

function generateInviteUrl() {
  return `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${config.permissions}&scope=bot%20applications.commands`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addbot")
    .setDescription("Botを導入するための招待ボタンを表示します。"),

  async execute(interaction) {
    // 招待チャンネル以外では使用不可
    if (!config.INVITE_CHANNEL_IDS.includes(interaction.channelId)) {
      return interaction.reply({
        content: "❌ このコマンドは招待専用チャンネルでのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🤖 Chill Bread Bot を追加")
        .setStyle(ButtonStyle.Link)
        .setURL(generateInviteUrl())
    );

    await interaction.reply({
      content:
        "下のボタンを押すと、あなたのサーバーへ **Chill Bread Bot** を追加できます！",
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  },
};