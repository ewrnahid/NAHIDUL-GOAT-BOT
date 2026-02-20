const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
config: {
  name: "owner",
  author: "Tokodori",
  role: 0,
  shortDescription: "Owner Information",
  longDescription: "View bot owner details",
  category: "admin",
  guide: "{p}{n}"
},

onStart: async function ({ api, event }) {
  try {

    const ownerInfo = {
      name: 'NAHIDUL ISLAM NAIM',
      gender: 'male👦',
      uid: '61585368534877',
      class: 'BOT OWNER 👑',
      Tiktokusername: 'unlucky_man1',
      profile: 'https://www.facebook.com/NATOKBAZ.NAIM1',
      birthday: 'Private',
      nickname: 'NAIM'
    };

    const videoURL = 'https://files.catbox.moe/qxcv3k.mp4';

    const tmpPath = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

    const videoRes = await axios.get(videoURL, { responseType: "arraybuffer" });
    const videoFile = path.join(tmpPath, "owner.mp4");

    fs.writeFileSync(videoFile, Buffer.from(videoRes.data, "binary"));

    const msg = `
╔════════════════════╗
      👑 𝗘𝗟𝗜𝗧𝗘 𝗢𝗪𝗡𝗘𝗥 𝗡𝗔𝗜𝗠 👑
╚════════════════════╝

✨ Welcome to the Official Profile
🔥 The Creator & Controller of This Bot 🔥
💎 Respect the Name — NAIM 💎

┏━━━━━━━━━━━━━━━━━━┓
┃      [ OWNER INFO ]      
┣━━━━━━━━━━━━━━━━━━┫
┃ ▶ Name      : ${ownerInfo.name}
┃ ▶ Nick      : ${ownerInfo.nick}
┃ ▶ Gender    : ${ownerInfo.gender}
┃ ▶ UID       : ${ownerInfo.uid}
┃ ▶ Class     : ${ownerInfo.class}
┃ ▶ Username  : ${ownerInfo.username}
┃ ▶ Profile   :
┃   ${ownerInfo.profile}
┃ ▶ Birthday  : ${ownerInfo.birthday}
┃ ▶ Friend with bot : Yes ✅
┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━┓
┃      [ OWNER STATS ]      
┣━━━━━━━━━━━━━━━━━━┫
┃ ▶ Power Level : 9999 ⚡
┃ ▶ Respect     : ∞ ♾
┃ ▶ Status      : Active 🟢
┃ ▶ Mood        : Focused 🎯
┗━━━━━━━━━━━━━━━━━━┛

╔════════════════════╗
 💬 “Code. Create. Conquer.”
╚════════════════════╝
`;

    await api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(videoFile)
    }, event.threadID, event.messageID);

    api.setMessageReaction("👑", event.messageID, () => {}, true);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error loading owner info.", event.threadID);
  }
}
};
