const { Client, Interaction, PermissionsBitField } = require("discord.js");
const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} = require("discord.js");

const Embed = require("#global/structures/Embed.js");

module.exports = {
    name: "disconnect",
    description: "Disconnect this channel from all JIRA projects.",
    devOnly: false,
    testOnly: false,
    deleted: false,
    options: [],
    permissionsRequired: [PermissionsBitField.Flags.ManageWebhooks],
    botPermissions: [],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        // Remove all projects that match the channel ID
        client.db.run(
            "DELETE FROM projects WHERE channelID = ?",
            [interaction.channel.id],
            (err) => {
                if (err) {
                    console.error(err);
                }
                console.log(
                    `🟢 | Projects for channel ${interaction.channel.id} have been untracked`
                );
            }
        );

        const successEmbed = new Embed(client, {
            title: "Success",
            description:
                "This channel has been disconnected from all JIRA projects",
        });

        await interaction.reply({
            embeds: [successEmbed],
            ephemeral: true,
        });
    },
};
