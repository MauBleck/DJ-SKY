const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ajusta o volume de 0 a 100')
    .addIntegerOption(opt =>
      opt.setName('level')
        .setDescription('Nível de volume')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  run: async (client, interaction) => {
    const vol = interaction.options.getInteger('level');
    const player = client.poru.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({ content: '❌ Não estou tocando nada!', ephemeral: true });
    }

    try {
      await player.setVolume(vol);
      return interaction.reply({ content: `🔊 Volume ajustado para **${vol}%**`, ephemeral: true });
    } catch (err) {
      console.error('Erro ao ajustar volume:', err);
      return interaction.reply({ content: '❌ Não foi possível ajustar o volume!', ephemeral: true });
    }
  }
};
