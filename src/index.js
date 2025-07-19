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

client.once('ready', async () => {
  await client.poru.init(client);
  console.log(`🤖 Logado como ${client.user.tag}`);

  require('./handlers/event')(client);
  require('./handlers/poruEvents')(client);
  await require('./handlers/slash')(client);
});

// Use o token do env aqui
client.login(process.env.DISCORD_TOKEN);
