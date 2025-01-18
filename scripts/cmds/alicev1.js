const axios = require('axios');

module.exports = {
  config: {
    name: 'alicev1',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ming'],
    description: "Gpt architecture",
    usage: "ai [prompt]",
    credits: 'Mark',
    cooldown: 3,
  },

  async onStart({ api, event, args }) {
    const { messageID, messageReply, threadID, senderID } = event;
    let userInput = args.join(" ").trim();

    if (messageReply) {
      const repliedMessage = messageReply.body;
      userInput = `${repliedMessage} ${userInput}`;
    }

    if (!userInput) {
      return api.sendMessage('Usage: ai [your question]', threadID, messageID);
    }

    // Get the current response time in Manila timezone
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

    // Add the system role for Alice AI
    const systemRole = 'You are Alice AI, a friendly and helpful assistant 😊.';
    const prompt = `${systemRole}\n${userInput}`;

    // Construct the API URL with the user input and system role
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderID}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        const generatedText = response.data.response;

        api.getUserInfo(senderID, (err, ret) => {
          if (err) {
            console.error('❌ Error fetching user info:', err);
            api.sendMessage('Error fetching user info.', threadID, messageID);
            return;
          }

          const userName = ret[senderID].name;
          const formattedResponse = `𝗔𝗹𝗶𝗰𝗲 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁 ✅
━━━━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━━━━\n🗣𝗔𝘀𝗸𝗲𝗱 𝗕𝘆: ${userName}\n⏰𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}\n━━━━━━━━━━━━━━━━━━`;

          api.sendMessage(formattedResponse, threadID, messageID);
        });
      } else {
        console.error('API response did not contain expected data:', response.data);
        api.sendMessage('❌ An error occurred while generating the text response. Please try again later.', threadID, messageID);
      }
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, threadID, messageID);
    }
  },
};
