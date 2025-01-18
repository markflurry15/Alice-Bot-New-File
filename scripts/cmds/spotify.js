const axios = require("axios");
const fs = require('fs-extra');
const { getStreamFromURL, shortenURL, randomString } = global.utils;

module.exports = {
  config: {
    name: "spotify",
    version: "1.7",
    author: "developer",
    countDown: 10,
    role: 1,
    shortDescription: "Search for a Spotify track using a keyword",
    longDescription: "Search and play a Spotify track using a keyword",
    category: "music",
    guide: "{pn} songname"
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return message.reply("Usage: spotify [music title]");
      }

      const res = await axios.get('https://hiroshi-api.onrender.com/tiktok/spotify', {
        params: { search: searchQuery }
      });

      if (!res || !res.data || res.data.length === 0) {
        throw new Error("No results found");
      }

      const { name: trackName, download, image, track } = res.data[0];

      await message.reply(`🎶 Now playing: ${trackName}\n\n🔗 Spotify Link: ${track}`);

      const imageStream = await getStreamFromURL(image);
      await message.reply({
        attachment: imageStream
      });

      const audioStream = await getStreamFromURL(download);
      await message.reply({
        attachment: audioStream
      });

      console.log("Audio and image sent successfully.");
    } catch (error) {
      console.error("Error retrieving the Spotify track:", error);
      message.reply("Error retrieving the Spotify track. Please try again or check your input.");
    }
  }
};
