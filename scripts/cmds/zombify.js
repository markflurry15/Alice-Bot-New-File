const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "zombify",
        version: "1.0",
        aliases: ["zombie"],
        author: "Mark & Makoy", 
        countDown: 10,
        role: 0,
        category: "image",
        shortDescription: "Turn an image into a zombie version",
        longDescription: "Transform any image into a zombie-like version. Reply to an image or add an image URL to use the command.",
        guide: {
            en: "{pn} reply to an image or add an image URL",
        },
    },

    onStart: async function ({ api, args, message, event }) {
        let imageUrl;
        if (event.type === "message_reply") {
            if (event.messageReply.attachments[0].type === "photo") {
                imageUrl = event.messageReply.attachments[0].url;
            }
        } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
            imageUrl = args[0];
        } else {
            return message.reply("Please provide an image URL or reply to an image!");
        }

        const processingMessage = await message.reply("🕞 | Transforming the image into a zombie version...");

        try {
            const response = await axios.get(`https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`, {
                responseType: "arraybuffer",
            });

            const outputBuffer = Buffer.from(response.data, "binary");

            const fileName = `${Date.now()}_zombie.png`;
            const filePath = `./${fileName}`;

            fs.writeFileSync(filePath, outputBuffer);

            // Send the image as an attachment
            await message.reply({
                attachment: fs.createReadStream(filePath),
            });

            // Delete the temporary image file after sending
            fs.unlinkSync(filePath);

        } catch (error) {
            message.reply("Something went wrong. Please try again later.");
        }

        // Delete the processing message
        message.unsend(processingMessage.messageID);
    },
};
