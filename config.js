export default {
  clientId: process.env.CLIENT_ID,
  token: process.env.DISCORD_TOKEN,
  nodes: [
    {
      name: "main_node",
      url: `${process.env.NODE_HOST}:${process.env.NODE_PORT}`,
      auth: process.env.NODE_PASSWORD,
      secure: false
    }
  ]
};
