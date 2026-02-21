const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

(async () => {
  const fontPath = path.join(__dirname, "cache", "english.ttf");
  if (!fs.existsSync(fontPath)) {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf",
      { responseType: "arraybuffer" }
    );
    await fs.outputFile(fontPath, data);
  }
  registerFont(fontPath, { family: "ModernoirBold" });
})();

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return y;
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y;
}

module.exports = {
  config: { name: "welcomeStyled", version: "2.2.0", author: "NAIM", category: "events" },

  onStart: async ({ message, event, threadsData, api }) => {
    if (event.logMessageType !== "log:subscribe") return;

    try {
      const threadID = event.threadID;
      const user = event.logMessageData.addedParticipants[0];
      const userName = user.fullName || "New Member";
      const threadData = await threadsData.get(threadID);
      const threadName = threadData.threadName || "Group Chat";
      const threadInfo = await api.getThreadInfo(threadID);
      const memberCount = threadInfo.participantIDs.length;

      const canvas = createCanvas(1000, 600);
      const ctx = canvas.getContext("2d");

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#f5c1e9");
      gradient.addColorStop(1, "#ffebd3");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative border
      ctx.strokeStyle = "#ff00aa";
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Overlay box
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Text style
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 6;

      let yPos = 120;
      ctx.font = "bold 36px ModernoirBold";
      ctx.fillText("╭•┄┅═══❁🌺❁═══┅┄•╮", canvas.width / 2, yPos);

      yPos += 50;
      ctx.font = "bold 42px ModernoirBold";
      ctx.fillText("আসসালামু আলাইকুম 🖤", canvas.width / 2, yPos);

      yPos += 50;
      ctx.font = "bold 36px ModernoirBold";
      ctx.fillText("╰•┄┅═══❁🌺❁═══┅┄•╯", canvas.width / 2, yPos);

      yPos += 60;
      ctx.font = "bold 48px ModernoirBold";
      ctx.fillStyle = "#ffea00";
      ctx.fillText("✨🆆🅴🅻🅲🅾🅼🅴✨", canvas.width / 2, yPos);

      yPos += 60;
      ctx.font = "bold 40px ModernoirBold";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`❥ 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 ❥`, canvas.width / 2, yPos);

      yPos += 50;
      ctx.font = "bold 36px ModernoirBold";
      ctx.fillText(`👤 [ ${userName} ]`, canvas.width / 2, yPos);

      yPos += 40;
      ctx.fillText(`🆔 সদস্য নং : #${memberCount}`, canvas.width / 2, yPos);

      yPos += 50;
      ctx.fillText(`আপনাকে স্বাগতম আমাদের`, canvas.width / 2, yPos);

      yPos += 40;
      ctx.fillText(`『 🌸 ${threadName} 🌸 』`, canvas.width / 2, yPos);

      yPos += 50;
      ctx.fillText(`আপনি এই গ্রুপের ${memberCount} নং সম্মানিত সদস্য 🤍`, canvas.width / 2, yPos);

      yPos += 50;
      ctx.fillText(`🌸 সক্রিয় থাকুন • নিয়ম মেনে চলুন`, canvas.width / 2, yPos);

      yPos += 60;
      ctx.fillText("╭•┄┅═══❁🌺❁═══┅┄•╮", canvas.width / 2, yPos);

      yPos += 40;
      ctx.fillStyle = "#ff69b4";
      ctx.fillText("🌸𝐍𝐚𝐡𝐢𝐝𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 𝐍𝐚𝐢𝐦🌸", canvas.width / 2, yPos);

      yPos += 50;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("╰•┄┅═══❁🌺❁═══┅┄•╯", canvas.width / 2, yPos);

      const imgPath = path.join(__dirname, "cache", `welcome_${user.userFbId}.png`);
      await fs.ensureDir(path.dirname(imgPath));
      const out = fs.createWriteStream(imgPath);
      canvas.createPNGStream().pipe(out);
      await new Promise(resolve => out.on("finish", resolve));

      await message.send({
        body: `🌸Welcome ${userName}🌸\nYou're member #${memberCount} of "${threadName}"!`,
        attachment: fs.createReadStream(imgPath)
      });
      fs.unlinkSync(imgPath);
    } catch (err) {
      console.error("❌ Styled welcome error:", err);
    }
  }
};
