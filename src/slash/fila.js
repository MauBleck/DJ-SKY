const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fila')
    .setDescription('Mostra as músicas na fila'),

  run: async (client, interaction) => {
    const player = client.poru.players.get(interaction.guild.id);

    if (!player || player.queue.size === 0) {
      return interaction.reply('❌ A fila está vazia!');
    }

    const queueString = player.queue
      .map((track, i) => `${i + 1}. [${track.info.title}](${track.info.uri})`)
      .slice(0, 10) // mostra até 10 músicas
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('Fila de Músicas')
      .setDescription(queueString)
      .setColor('Blue');

    interaction.reply({ embeds: [embed] });
  }
};
