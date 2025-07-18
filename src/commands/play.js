module.exports = {
  data: new require('@discordjs/builders').SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música pelo link ou nome')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nome ou link da música')
        .setRequired(true)
    ),

  async execute(interaction, aqualink) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply({ content: 'Você precisa estar em um canal de voz!', ephemeral: true });

    // Pega o player, se não existir cria
    let player = aqualink.players.get(interaction.guild.id);
    if (!player) {
      player = aqualink.players.create({
        guildId: interaction.guild.id,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
      });
    }

    if (!player.connected) await player.connect();

    const results = await aqualink.rest.loadTracks(query);
    if (!results || !results.tracks.length) return interaction.reply({ content: 'Nenhuma música encontrada.', ephemeral: true });

    player.queue.add(results.tracks[0]);

    if (!player.playing && !player.paused) {
      await player.play();
    }

    await interaction.reply(`🎶 Tocando agora: **${results.tracks[0].info.title}**`);
  },
};
