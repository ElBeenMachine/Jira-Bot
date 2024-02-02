const { Client, Interaction } = require("discord.js");
const Embed = require("../../structures/Embed");

module.exports = {
    name: "register",
    description: "Register your JIRA account with the bot.",
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
        const OAuth2URL = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=8WvxYT6WgFNeUdieMdCFtrgBwTYPtSfc&scope=read%3Aproject%3Ajira%20read%3Aboard-scope%3Ajira-software%20read%3Ame%20read%3Ajira-user%20read%3Ajira-work%20write%3Ajira-work%20manage%3Ajira-webhooks&redirect_uri=https%3A%2F%2Fjira-auth.ljmu.dev%2Fcallback&state=${interaction.user.id}&response_type=code&prompt=consent`;

        const embed = new Embed(client, {
            title: "🔒 Register Your Account",
            description: `Click [here](${OAuth2URL}) to get your access token. Once you have your token, use \`/authenticate\` to log in.`,
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
