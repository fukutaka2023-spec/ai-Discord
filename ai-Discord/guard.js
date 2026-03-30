require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.once("ready", () => console.log("🛡 ガードマンBot 起動"));
client.login(process.env.GUARD_TOKEN);
module.exports = client;