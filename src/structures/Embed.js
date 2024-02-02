const { EmbedBuilder, Client } = require("discord.js");

class Embed extends EmbedBuilder {
    /**
     *
     * @param {Client} client
     * @param {Object} options
     */
    constructor(client, options = {}) {
        super();
        this.setTitle(options?.title || "Untitled Embed");
        if (options?.description) {
            this.setDescription(options.description);
        }
        this.setTimestamp();
        this.setColor(options?.color || 0x3005ff);
        this.setFooter({
            text: `${client.user.username}   |   Created By Ollie B`,
            iconURL: client.user.displayAvatarURL(),
        });
    }
}

module.exports = Embed;
