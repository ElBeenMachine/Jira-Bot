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
        // Check if the user is already authenticated
        function getUser(id) {
            return new Promise((resolve, reject) => {
                client.db.get(
                    "SELECT * FROM users WHERE id = ?",
                    [id],
                    (err, row) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                        resolve(row);
                    }
                );
            });
        }

        const user = await getUser(interaction.user.id);

        if (user) {
            return await interaction.reply({
                content: "You are already authenticated with JIRA.",
                ephemeral: true,
            });
        }

        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId("jiraAuthModal")
            .setTitle("Authenticate with Jira");

        // Add components to modal
        const tokenInput = new TextInputBuilder()
            .setCustomId("codeInput")
            .setLabel("Enter your JIRA access code")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Your JIRA access code");

        const actionRow = new ActionRowBuilder().addComponents(tokenInput);

        // Add inputs to the modal
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
