const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp) global.temp = {};
if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "english.ttf");
    if (!fs.existsSync(fontPath)) {
      const fontUrl = "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/main/english.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
    }
    registerFont(fontPath, { family: "ModernoirBold" });
  } catch (err) {
    console.error("Font load error:", err);
  }
})();

module.exports = {
  config: {
    name: "welcome",
    version: "3.0.0",
    author: "NAIM PREMIUM",
    category: "events"
  },

  onStart: async ({ api, event, threadsData, message }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const threadID = event.threadID;
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    const user = dataAddedParticipants[0];

    const threadData = await threadsData.get(threadID);
    if (threadData?.settings?.sendWelcomeMessage === false) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const memberCount = threadInfo.participantIDs.length;

    const displayUserName = user.fullName || "New Member";
    const displayThreadName = threadInfo.threadName || "Group Chat";
    const userID = user.userFbId;

    // Background random
    const backgrounds = [
      "https://files.catbox.moe/yvvskl.jpeg",
      "https://files.catbox.moe/te78hj.jpeg",
      "https://files.catbox.moe/7ufcfb.jpg"
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");

    // Draw background
    const bgRes = await axios.get(randomBg, { responseType: "arraybuffer" });
    const bg = await loadImage(bgRes.data);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Load avatar
    let avatar;
    try {
      const avatarRes = await axios.get(
        `https://graph.facebook.com/${userID}/picture?height=720&width=720`,
        { responseType: "arraybuffer" }
      );
      avatar = await loadImage(avatarRes.data);
    } catch {
      avatar = await loadImage("https://i.ibb.co/2kR9xgQ/default-avatar.png");
    }

    const avatarSize = 180;
    const avatarX = canvas.width / 2 - avatarSize / 2;
    const avatarY = 40;

    // Circle avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Golden Glow Border
    ctx.beginPath();
    ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2 + 8, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 25;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glass Gradient Overlay
    const overlayHeight = 220;
    const gradient = ctx.createLinearGradient(
      0,
      canvas.height - overlayHeight,
      0,
      canvas.height
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);

    ctx.textAlign = "center";
    const centerX = canvas.width / 2;
    let currentY = canvas.height - overlayHeight + 50;

    // Title
    ctx.font = "bold 48px ModernoirBold";
    ctx.fillStyle = "#00f7ff";
    ctx.shadowColor = "#00f7ff";
    ctx.shadowBlur = 20;
    ctx.fillText("✨ ASSALAMUALAIKUM ✨", centerX, currentY);
    ctx.shadowBlur = 0;

    // Username
    currentY += 55;
    ctx.font = "bold 36px ModernoirBold";
    ctx.fillStyle = "#ffcc00";
    ctx.fillText(`👤 ${displayUserName}`, centerX, currentY);

    // Welcome line
    currentY += 45;
    ctx.font = "bold 28px ModernoirBold";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Welcome to ${displayThreadName}`, centerX, currentY);

    // Member counter
    currentY += 40;
    ctx.font = "bold 26px ModernoirBold";
    ctx.fillStyle = "#00ffcc";
    ctx.fillText(`🎊 Member No: #${memberCount}`, centerX, currentY);

    // Save image
    const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
    await fs.ensureDir(path.dirname(imgPath));

    const out = fs.createWriteStream(imgPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise(resolve => out.on("finish", resolve));

    // Stylish Join Message
    const stylishMessage = `
╔══════════════════╗
      🌟  NEW MEMBER  🌟
╚══════════════════╝

👤 Name: ${displayUserName}
🏷️ Group: ${displayThreadName}
🎊 Member No: #${memberCount}

🌙 May Allah bless you
✨ Stay active & enjoy!
━━━━━━━━━━━━━━━━━━
`;

    message.send(
      {
        body: stylishMessage,
        attachment: fs.createReadStream(imgPath)
      },
      () => {
        try {
          fs.unlinkSync(imgPath);
        } catch (e) {}
      }
    );
  }
};
