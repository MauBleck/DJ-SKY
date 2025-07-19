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

// 1) Inicializa o Poru ANTES de carregar qualquer handler
client.poru = new Poru(client, config.NODES, {
  library: 'discord.js',
  defaultPlatform: 'ytsearch',
});


// 3) Quando o bot estiver pronto:
client.once('ready', async () => {
  await client.poru.init(client);
  console.log(`🤖 Logado como ${client.user.tag}`);

  // Agora que o Poru foi inicializado, carregue os handlers que dependem dele
  require('./handlers/event')(client);      // interactionCreate
  require('./handlers/poruEvents')(client); // eventos do Poru
  await require('./handlers/slash')(client); // registro de slash commands
});

// 4) Login
client.login(config.TOKEN);
