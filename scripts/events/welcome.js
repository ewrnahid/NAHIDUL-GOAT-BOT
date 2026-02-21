// Example: Node.js / Canvas welcome message

const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

async function generateWelcome(memberName, memberID, groupName, avatarURL) {
  const canvas = createCanvas(1000, 600);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1c1c1c"; // Dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fonts
  const fontPath = path.join(__dirname, "cache", "english.ttf");
  if (fs.existsSync(fontPath)) registerFont(fontPath, { family: "ModernoirBold" });
  ctx.textAlign = "center";

  // Top Header
  ctx.fillStyle = "#ff69b4";
  ctx.font = "bold 28px ModernoirBold";
  ctx.fillText("╭•┄┅═══❁🌺❁═══┅┄•╮", canvas.width / 2, 50);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px ModernoirBold";
  ctx.fillText("আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ 🖤", canvas.width / 2, 85);
  ctx.fillStyle = "#ff69b4";
  ctx.fillText("╰•┄┅═══❁🌺❁═══┅┄•╯", canvas.width / 2, 120);

  // Welcome Title
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 40px ModernoirBold";
  ctx.fillText("✨🆆🅴🅻🅲🅾🅼🅴✨", canvas.width / 2, 170);

  // NEW MEMBER
  ctx.fillStyle = "#ff1493";
  ctx.font = "bold 30px ModernoirBold";
  ctx.fillText("❥ 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 ❥", canvas.width / 2, 210);

  // Profile Box
  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 28px ModernoirBold";
  ctx.fillText(`👤 ${memberName}`, canvas.width / 2, 260);
  ctx.fillText(`🆔 সদস্য নং : #${memberID}`, canvas.width / 2, 300);

  // DP Placeholder (circle)
  ctx.strokeStyle = "#ff69b4";
  ctx.lineWidth = 6;
  const dpX = canvas.width / 2;
  const dpY = 380;
  const dpRadius = 80;
  ctx.beginPath();
  ctx.arc(dpX, dpY, dpRadius, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.closePath();

  // Insert Avatar if provided
  if (avatarURL) {
    try {
      const avatarResp = await loadImage(avatarURL);
      ctx.save();
      ctx.beginPath();
      ctx.arc(dpX, dpY, dpRadius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarResp, dpX - dpRadius, dpY - dpRadius, dpRadius * 2, dpRadius * 2);
      ctx.restore();
    } catch (e) {
      console.log("Avatar load failed:", e.message);
    }
  }

  // Group Welcome
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 26px ModernoirBold";
  ctx.fillText(`আপনাকে স্বাগতম আমাদের 『 🌸 ${groupName} 🌸 』`, canvas.width / 2, 480);
  ctx.fillText(`আপনি এই গ্রুপের #${memberID} নং সম্মানিত সদস্য 🤍`, canvas.width / 2, 520);

  // Footer
  ctx.fillStyle = "#ff69b4";
  ctx.font = "bold 22px ModernoirBold";
  ctx.fillText("╭•┄┅═══❁🌺❁═══┅┄•╮", canvas.width / 2, 560);
  ctx.fillText("🌸  সক্রিয় থাকুন • নিয়ম মেনে চলুন  🌸", canvas.width / 2, 590);
  ctx.fillText("🌙  আল্লাহ আপনাকে উত্তম প্রতিদান দিন  🌙", canvas.width / 2, 620);
  ctx.fillText("╰•┄┅═══❁🌺❁═══┅┄•╯", canvas.width / 2, 650);

  // Save
  const outPath = path.join(__dirname, `welcome_${memberID}.png`);
  const out = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  await new Promise(resolve => out.on("finish", resolve));
  return outPath;
}

// Example usage
// generateWelcome("Naim", 1, "My Group", "https://graph.facebook.com/USER_ID/picture?height=720&width=720");
