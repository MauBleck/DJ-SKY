require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Poru } = require('poru');
const config = require('./config/config.json');
const path = require('path');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.slash = new Collection();

// Inicializa Poru
client.poru = new Poru(client, config.NODES, {
  library: 'discord.js',
  defaultPlatform: 'ytsearch',
});

// Eventos do node devem estar fora do client.once('ready')
client.poru.on('nodeConnect', (node) => {
  console.log(`✅ Node conectado: ${node.name}`);
});

client.poru.on('nodeError', (node, error) => {
  console.error(`❌ Erro ao conectar ao node ${node.name}:`, error);
});

client.poru.on('nodeClose', (node, code, reason) => {
  console.warn(`⚠️ Node ${node.name} foi desconectado. Código: ${code}, Motivo: ${reason}`);
});

client.once('ready', async () => {
  await client.poru.init(client);
  console.log(`🤖 Logado como ${client.user.tag}`);

  require('./handlers/event')(client);
  require('./handlers/poruEvents')(client);
  await require('./handlers/slash')(client);
});

client.login(process.env.DISCORD_TOKEN);
