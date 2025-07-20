const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Mostra a música que está tocando agora'),

  run: async (client, interaction) => {
    const player = client.poru.players.get(interaction.guild.id);
    if (!player || !player.currentTrack) {
      return interaction.reply({ content: '❌ Não estou tocando nada!', ephemeral: true });
    }

    const track = player.currentTrack.info;
    const lengthMs = track.length; // duração em ms
    const minutes = Math.floor(lengthMs / 60000);
    const seconds = Math.floor((lengthMs % 60000) / 1000).toString().padStart(2, '0');
    const timestamp = player.position; // posição atual em ms
    const posMin = Math.floor(timestamp / 60000);
    const posSec = Math.floor((timestamp % 60000) / 1000).toString().padStart(2, '0');

    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${track.title}](${track.uri})`)
      .addFields(
        { name: '🔊 Autor', value: track.author, inline: true },
        { name: '⏱ Duração', value: `${minutes}:${seconds}`, inline: true },
        { name: '▶️ Posição', value: `${posMin}:${posSec}`, inline: true },
      )
      .setColor('Blue');

    return interaction.reply({ embeds: [embed] });
  }
};
