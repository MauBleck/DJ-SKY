const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { Aqua } = require('aqualink');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const nodes = [
  {
    name: 'main_node',
    url: `${process.env.NODE_HOST}:${process.env.NODE_PORT}`,  // ex: "127.0.0.1:1038"
    auth: process.env.NODE_PASSWORD,
    secure: false,
  },
];

const aqualink = new Aqua({
  nodes,
  user: client.user?.id || process.env.CLIENT_ID, // id do bot
  shards: 1,
});

client.aqualink = aqualink;

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logado como ${client.user.tag}`);

  aqualink.connect(client);
});

// comandos carregados e evento interaction para executar comandos aqui...

client.login(process.env.DISCORD_TOKEN);
