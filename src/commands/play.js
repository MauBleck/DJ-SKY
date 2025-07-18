const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
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

    if (!voiceChannel) {
      return interaction.reply({ content: 'Você precisa estar em um canal de voz!', ephemeral: true });
    }

    if (!interaction.guild || !interaction.channel) {
      return interaction.reply({ content: 'Erro ao obter informações do servidor ou canal.', ephemeral: true });
    }

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

    if (!results || !results.tracks.length) {
      return interaction.reply({ content: 'Nenhuma música encontrada.', ephemeral: true });
    }

    const track = results.tracks[0];
    player.queue.add(track);

    if (!player.playing && !player.paused) {
      await player.play();
    }

    await interaction.reply(`🎶 Tocando agora: **${track.info.title}**`);
  },
};
