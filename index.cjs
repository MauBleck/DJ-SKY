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
    url: `${process.env.NODE_HOST}:${process.env.NODE_PORT}`,  // ex: "69.30.219.179:1038"
    auth: process.env.NODE_PASSWORD,
    secure: false,
  },
];

const aqualink = new Aqua({
  nodes,
  user: process.env.CLIENT_ID,
  shards: 1,
});

client.aqualink = aqualink;

client.once(Events.ClientReady, () => {
  console.log(`Logado como ${client.user.tag}`);
  aqualink.connect(client);
});

client.login(process.env.DISCORD_TOKEN);
