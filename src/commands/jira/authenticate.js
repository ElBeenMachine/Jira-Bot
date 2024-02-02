const { Client, Interaction } = require("discord.js");
const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require("discord.js");

module.exports = {
    name: "authenticate",
    description: "Authenticate your JIRA account with your access token.",
    devOnly: false,
    testOnly: false,
    deleted: false,
    options: [],
    permissionsRequired: [],
    botPermissions: [],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId("jiraAuthModal")
            .setTitle("Authenticate with Jira");

        // Add components to modal
        const tokenInput = new TextInputBuilder()
            .setCustomId("tokenInput")
            .setLabel("Enter your JIRA access token")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Your JIRA access token");

        const actionRow = new ActionRowBuilder().addComponents(tokenInput);

        // Add inputs to the modal
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
