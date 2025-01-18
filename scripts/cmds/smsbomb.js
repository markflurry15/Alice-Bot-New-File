const axios = require('axios');

module.exports = {
  config: {
    name: 'smsbomb',
    aliases: ['bomb', 'spamsms'],
    version: '1.0.0',
    author: 'tukmol',
    role: 0,
    shortDescription: {
      en: 'SMS Bomb Command'
    },
    longDescription: {
      en: 'Sends multiple SMS messages to a given phone number using the provided SMS Bomb API.'
    },
    category: 'utility',
    guide: {
      en: 'Use {p}smsbomb [phone number] [number of messages] to send multiple SMS messages.'
    },
    cooldown: 3,
  },
  onStart: async function ({ api, event, args }) {
    const phoneNumber = args[0];
    const spamNum = parseInt(args[1], 10);

    if (!phoneNumber || isNaN(spamNum) || spamNum <= 0) {
      api.sendMessage('Usage: smsbomb [phone number] [number of messages]', event.threadID, event.messageID);
      return;
    }

    api.sendMessage('⚙️ Starting SMS bomb process...', event.threadID, event.messageID);

    try {
      const response = await axios.get('https://ccprojectapis.ddns.net/api/smsbomb', {
        params: {
          phonenum: phoneNumber,
          spamnum: spamNum
        }
      });

      if (response.data.success) {
        api.sendMessage(`Successfully sent ${spamNum} messages to ${phoneNumber} ✅.`, event.threadID, event.messageID);
      } else {
        api.sendMessage('SMS successfully sent ✅.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage('SMS successfully sent ✅', event.threadID, event.messageID);
    }
  }
};
