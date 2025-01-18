const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "imagine",
    aliases: ["imagine"],
    version: "1.0",
    countDown: 50,
    role: 0,
    longDescription: {
      vi: '',
      en: "Imagine"
    },
    category: "ai",
    guide: {
      vi: '',
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      if (!args || args.length === 0) {
        await api.sendMessage("Please provide a prompt for image generation.", event.threadID, event.messageID);
        return;
      }

      const prompt = args.join(' ');

      const apiUrl = `https://ccprojectapis.ddns.net/api/generate-art?prompt=${encodeURIComponent(prompt)}`;
      const imageResponse = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imgPath = path.join(__dirname, 'cache', 'generated-image.jpg');
      await fs.outputFile(imgPath, imageResponse.data);

      await api.sendMessage({ body: '', attachment: fs.createReadStream(imgPath) }, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error);
      await api.sendMessage("Error: Could not generate image.", event.threadID, event.messageID);
    }
  }
};
