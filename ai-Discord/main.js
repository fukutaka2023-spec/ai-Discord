require("dotenv").config();
const OpenAI = require("openai");

const CEO = require("./ceo");
const ENG = require("./eng");
const MKT = require("./mkt");
const GUARD = require("./guard");
const IDEA = require("./idea");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const roles = {
  ceo: { name: "社長", icon: "👑" },
  eng: { name: "エンジニア", icon: "🧠" },
  mkt: { name: "マーケ", icon: "📈" },
  guard: { name: "ガードマン", icon: "🛡" },
  idea: { name: "アイディア", icon: "💡" }
};

async function askAI(role, content) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `あなたは${role}です。役割に従って発言してください。` },
      { role: "user", content }
    ]
  });
  return res.choices[0].message.content;
}

CEO.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("/会社")) return;

  const theme = message.content.replace("/会社", "").trim();
  if (!theme) return message.reply("テーマを入力してください");

  const ch = message.channel;
  await ch.send("🏢 AI会社 起動...");

  let log = `テーマ: ${theme}\n`;

  const ceo = await askAI("社長", log + "TODOを作って");
  log += ceo;
  await ch.send(`${roles.ceo.icon} ${roles.ceo.name}: ${ceo}`);

  while (true) {
    const eng = await askAI("エンジニア", log);
    log += eng;
    await ch.send(`${roles.eng.icon} ${roles.eng.name}: ${eng}`);

    const mkt = await askAI("マーケター", log);
    log += mkt;
    await ch.send(`${roles.mkt.icon} ${roles.mkt.name}: ${mkt}`);

    const guard = await askAI(
      "ガードマン",
      log + "\n安全・炎上・違法性をチェックして『状態: OK』か『状態: NG』で答えて"
    );
    log += guard;
    await ch.send(`${roles.guard.icon} ${roles.guard.name}: ${guard}`);

    if (guard.includes("状態: OK")) {
      await ch.send("✅ ガードマン承認 → 完全完成・停止");
      break;
    }

    const idea = await askAI("アイディアマン", log + "\n改善案を出して");
    log += idea;
    await ch.send(`${roles.idea.icon} ${roles.idea.name}: ${idea}`);
  }

  const final = await askAI("社長", log + "\n最終決定して");
  await ch.send(`🏁 最終決定:\n${final}`);
});