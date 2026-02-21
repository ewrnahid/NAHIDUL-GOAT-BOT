module.exports = {
  config: {
    name: "welcome",
    version: "2.0.1",
    author: "NAIM",
    category: "events"
  },

  onStart: async ({ event, api, threadsData, usersData, message }) => {
    if (event.logMessageType !== "log:subscribe") return;

    try {
      const threadID = event.threadID;
      const dataAddedParticipants = event.logMessageData?.addedParticipants || [];
      const user = dataAddedParticipants[0] || {};
      const userName = user.fullName?.trim() || "New Member";
      const userID = user.userFbId || "0";

      // Get thread info safely
      let threadName = "Group";
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        threadName = threadInfo.threadName || threadName;
      } catch {
        threadName = "Group";
      }

      // Count of total members for “নং সদস্য”
      let memberCount = dataAddedParticipants.length;
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        memberCount = threadInfo.participantIDs?.length || memberCount;
      } catch {}

      // VIP Welcome Template
      const welcomeMessage = `
╭•┄┅═══❁🌺❁═══┅┄•╮
আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ 🖤
╰•┄┅═══❁🌺❁═══┅┄•╯

✨🆆🅴🅻🅲🅾🅼🅴✨
❥𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 ❥
━━━━━━━━━━━━━━━━━

👤 [ ${userName} ]
🆔 সদস্য নং : #${memberCount}

──  🌿  PROFILE  🌿  ──
   ◯        ◯
( এখানে DP বসবে )
   ◯        ◯

আপনাকে স্বাগতম আমাদের
『 🌸 ${threadName} 🌸 』

আপনি এই গ্রুপের ${memberCount} নং সম্মানিত সদস্য 🤍

╭•┄┅═══❁🌺❁═══┅┄•╮
🌸  সক্রিয় থাকুন • নিয়ম মেনে চলুন  🌸
🌙  আল্লাহ আপনাকে উত্তম প্রতিদান দিন  🌙
╰•┄┅═══❁🌺❁═══┅┄•╯
╭•┄┅═══❁🌺❁═══┅┄•╮
🌸𝐍𝐚𝐡𝐢𝐝𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 𝐍𝐚𝐢𝐦🌸
╰•┄┅═══❁🌺❁═══┅┄•╯
`;

      await api.sendMessage(welcomeMessage, threadID);
    } catch (err) {
      console.error("❌ Welcome event error:", err);
    }
  }
};
