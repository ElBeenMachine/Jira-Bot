const { Client, Interaction } = require("discord.js");
const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} = require("discord.js");

const Embed = require("#structures/Embed.js");

module.exports = {
    name: "connect",
    description: "Connect this channel to a JIRA project.",
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
        // Function to get a user from the database
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

        // Get the user who triggered the interaction from the database
        const user = await getUser(interaction.user.id);

        // If the user is not authenticated with JIRA, send an error message
        if (!user) {
            const errorEmbed = new Embed(client, {
                title: "An error has occurred",
                description: "You are not authenticated with JIRA",
                color: 0xff0000,
            });

            return await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
            });
        }

        // Fetch the sites that the user has access to
        const sitesReq = await fetch(
            "https://api.atlassian.com/oauth/token/accessible-resources",
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    Accept: "application/json",
                },
            }
        );

        // Parse the response to JSON
        const sites = await sitesReq.json();

        // Create a select menu for the sites
        const siteSelect = new StringSelectMenuBuilder()
            .setCustomId("siteMenu")
            .setPlaceholder("Select a Site");

        // Add each site as an option in the select menu
        sites.forEach((site) => {
            siteSelect.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(site.name)
                    .setDescription(site.url)
                    .setValue(`https://api.atlassian.com/ex/jira/${site.id}`)
            );
        });

        // Create an action row with the select menu
        const siteRow = new ActionRowBuilder().addComponents(siteSelect);

        // Send a message with the select menu
        const response = await interaction.reply({
            content: "Choose your site!",
            components: [siteRow],
            ephemeral: true,
        });

        // Define a filter for the message component collector
        const collectorFilter = (i) => i.user.id === interaction.user.id;

        // Wait for the user to select a site
        const siteConfirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000,
        });

        // Get the selected site
        const site = siteConfirmation.values[0];

        // Fetch the projects of the selected site
        const projectsReq = await fetch(`${site}/rest/api/latest/project`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                Accept: "application/json",
            },
        });

        // Parse the response to JSON
        const projects = await projectsReq.json();

        // Create a select menu for the projects
        const projectSelect = new StringSelectMenuBuilder()
            .setCustomId("projectMenu")
            .setPlaceholder("Select a Project");

        // Add each project as an option in the select menu
        projects.forEach((project) => {
            projectSelect.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(project.name)
                    .setDescription(project.key)
                    .setValue(project.id)
            );
        });

        // Create an action row with the select menu
        const projectsRow = new ActionRowBuilder().addComponents(projectSelect);

        // Update the message to ask the user to select a project
        await siteConfirmation.update({
            content: `Select the project you would like to monitor:`,
            components: [projectsRow],
        });

        // Wait for the user to select a project
        const projectConfirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000,
        });

        // Get the selected project
        const project = projectConfirmation.values[0];

        // Update the message to confirm that the project has been connected
        projectConfirmation.update({
            embeds: [
                new Embed(client, {
                    title: "Project Connected",
                    description: `This channel has been connected to a project with the ID: ${project}`,
                }),
            ],
            components: [],
        });
    },
};
