const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "info",
		aliases: ["admin"],
		author: "ullash",
		role: 0,
		shortDescription: "info and my owner the cmd",
		longDescription: "",
		category: "INFO",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const NAIMInfo = {
				name: '𝐍 𝐚 𝐢 𝐦 ッ',
				gender: '𝐌𝐚𝐥𝐞',
				age: '17',
				Tiktok: 'unlucky_man0.1',
				Relationship: 'single',
				religion: '𝐈𝐬𝐥𝐚𝐦',
				facebook: 'https://www.facebook.com/NATOKBAZ.NAIM1'
			};

			const NAIM = 'https://files.catbox.moe/do2kb3.jpeg';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const imgResponse = await axios.get(NAIM, { responseType: 'arraybuffer' });
			const imgPath = path.join(tmpFolderPath, 'owner_img.jpeg');

			fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'));

			const response = `╭─────❁
│  𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢  
│
│𝐍𝐚𝐦𝐞: ${NAIMInfo.name}
│𝐆𝐞𝐧𝐝𝐞𝐫 : ${NAIMInfo.gender}
│𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : ${NAIMInfo.Relationship}
│𝐀𝐠𝐞 : ${NAIMInfo.age}
│𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧: ${NAIMInfo.religion}
│𝐓𝐢𝐤𝐭𝐨𝐤 : ${NAIMInfo.Tiktok}
│𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: ${NAIMInfo.facebook}
╰────────────❁`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(imgPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(imgPath);

			api.setMessageReaction('👑', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in NAIM info command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};
