const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchTikTokVideos(searchQuery) {
  try {
    const apiUrl = `https://markdevs-last-api-vtjp.onrender.com/api/tiksearch?search=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(apiUrl);
    return response.data.data.videos;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "tiksearch",
    aliases: [],
    author: "developer",
    version: "1.0",
    shortDescription: {
      en: "Search for TikTok videos",
    },
    longDescription: {
      en: "Search for TikTok videos by providing a search text",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [search text]",
    },
  },
  onStart: async function ({ api, event, args }) {
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      api.sendMessage({ body: 'Usage: tiksearch <search text>' }, event.threadID);
      return;
    }

    const videos = await fetchTikTokVideos(searchQuery);

    if (!videos || videos.length === 0) {
      api.sendMessage({ body: `No videos found for the search query: ${searchQuery}.` }, event.threadID, event.messageID);
      return;
    }

    const selectedVideo = videos[0];
    const videoUrl = selectedVideo.play;

    if (!videoUrl) {
      api.sendMessage({ body: 'Error: Video not found.' }, event.threadID, event.messageID);
      return;
    }

    const message = `📹 Tiksearch Result:\n\n👤 Post by: ${selectedVideo.author.nickname}\n🔗 Username: ${selectedVideo.author.unique_id}\n\n📝 Title: ${selectedVideo.title}`;

    api.sendMessage({ body: message }, event.threadID, event.messageID);

    try {
      const videoStream = await getStreamFromURL(videoUrl);

      await api.sendMessage({
        body: `Here is your TikTok video:`,
        attachment: videoStream,
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the video.\nPlease try again later.' }, event.threadID, event.messageID);
    }
  },
};
