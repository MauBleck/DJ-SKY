const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música ou adiciona à fila.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nome ou URL da música')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const query = interaction.options.getString('query');
    const member = interaction.member;

    if (!member.voice.channel) {
      return interaction.reply({ content: '❌ Você precisa estar em um canal de voz!', ephemeral: true });
    }

    const player = client.poru.players.get(interaction.guild.id);

    if (!player) {
      client.poru.createConnection({
        guildId: interaction.guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel.id,
        deaf: true,
      });
    }

    const resolvedPlayer = client.poru.players.get(interaction.guild.id);
    const result = await client.poru.resolve({ query, source: 'ytsearch' });

    if (!result || !result.tracks.length) {
      return interaction.reply({ content: '❌ Nenhuma música encontrada!', ephemeral: true });
    }

    const track = result.tracks[0];

    resolvedPlayer.queue.add(track);

    if (!resolvedPlayer.isPlaying && !resolvedPlayer.isPaused) {
      resolvedPlayer.play();
      return interaction.reply({ content: `▶️ Tocando agora: **${track.info.title}**` });
    } else {
      return interaction.reply({ content: `📥 Adicionado à fila: **${track.info.title}**` });
    }
  }
};
