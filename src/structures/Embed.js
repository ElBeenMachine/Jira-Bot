const { EmbedBuilder, Client, Embed } = require("discord.js");

/**
 *
 * @inheritdoc
 * @class Embed @extend EmbedBuilder
 */
class EmbedClass extends EmbedBuilder {
    /**
     *
     * @param {Client} client
     * @param {Object} options
     */
    constructor(client, options = {}) {
        if (!client)
            throw new Error("A client must be provided to the Embed class");

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

module.exports = EmbedClass;
