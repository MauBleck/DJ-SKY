const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música do YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nome ou URL da música')
        .setRequired(true)),
  
  run: async (client, interaction) => {
    const query = interaction.options.getString('query');
    console.log('query recebida:', query);
    
    if (!query) {
      return interaction.reply({ content: '❌ Você precisa informar o nome ou URL da música!', ephemeral: true });
    }
    
    // resto do seu código play...

    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Você precisa estar em um canal de voz!', ephemeral: true });
    }

    let player = client.poru.players.get(interaction.guild.id);
    if (!player) {
      player = await client.poru.createConnection({
        guildId: interaction.guild.id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel.id,
        deaf: true,
      });
    }

    let resolved;
    try {
      resolved = await client.poru.resolve({ query, source: 'ytsearch' });
    } catch (err) {
      console.error('Erro ao resolver música:', err);
      return interaction.reply({ content: '❌ Erro ao buscar a música!', ephemeral: true });
    }

    const track = resolved.tracks[0];
    if (!track) {
      return interaction.reply({ content: '❌ Nenhuma música encontrada!', ephemeral: true });
    }

    player.queue.add(track);

    if (!player.isPlaying && !player.isPaused) {
      player.play();
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setDescription(`🎵 Tocando: [${track.info.title}](${track.info.uri})`);

    return interaction.reply({ embeds: [embed] });
  }
};
