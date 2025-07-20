const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove uma música da fila pelo número')
    .addIntegerOption(opt =>
      opt.setName('index')
        .setDescription('Posição da música na fila (1 = próxima)')
        .setRequired(true)
        .setMinValue(1)
    ),

  run: async (client, interaction) => {
    const idx = interaction.options.getInteger('index');
    const player = client.poru.players.get(interaction.guild.id);

    if (!player || player.queue.length === 0) {
      return interaction.reply({ content: '❌ A fila está vazia!', ephemeral: true });
    }
    if (idx > player.queue.length) {
      return interaction.reply({ content: '❌ Índice inválido!', ephemeral: true });
    }

    const removed = player.queue.splice(idx - 1, 1)[0];
    return interaction.reply({ content: `🗑️ Removida da fila: **${removed.info.title}**`, ephemeral: true });
  }
};
