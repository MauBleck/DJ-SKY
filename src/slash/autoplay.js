const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Alterna o modo Autoplay (toca faixas similares após a fila)'),

  run: async (client, interaction) => {
    const player = client.poru.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({ content: '❌ Não estou tocando nada!', ephemeral: true });
    }

    // Próximo estado: inverte o estado atual
    const nextState = !player.isAutoPlay;
    try {
      // Usa o método correto do Poru
      await player.autoplay(nextState);
      return interaction.reply({
        content: `🔁 Autoplay ${nextState ? 'ativado' : 'desativado'}!`,
        ephemeral: true
      });
    } catch (err) {
      console.error('Erro ao alternar autoplay:', err);
      return interaction.reply({
        content: '❌ Não foi possível alterar o Autoplay!',
        ephemeral: true
      });
    }
  }
};
