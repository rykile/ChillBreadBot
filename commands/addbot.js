const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const config = require("../config");

function generateInviteUrl() {
  return `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${config.permissions}&scope=bot%20applications.commands`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addbot")
    .setDescription("Botを導入します"),

  async execute(interaction) {
    if (interaction.channelId !== config.INVITE_CHANNEL_ID) {
      return interaction.reply({
        content: "このコマンドは招待チャンネルでのみ使用できます。",
        ephemeral: true,
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🤖 Botを追加")
        .setStyle(ButtonStyle.Link)
        .setURL(generateInviteUrl())
    );

    await interaction.reply({
      content: "こちらからBotを導入できます。",
      components: [row],
      ephemeral: true,
    });
  },
};
};