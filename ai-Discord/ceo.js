require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.once("ready", () => console.log("👑 社長Bot 起動"));
client.login(process.env.CEO_TOKEN);
module.exports = client;