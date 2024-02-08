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
        const OAuth2URL = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=8WvxYT6WgFNeUdieMdCFtrgBwTYPtSfc&scope=offline_access%20read%3Ajira-work%20write%3Ajira-work%20manage%3Ajira-webhook%20read%3Ajira-user&redirect_uri=https%3A%2F%2Fjira-auth.ljmu.dev%2Fcallback&state=${interaction.user.id}&response_type=code&prompt=consent`;

        const embed = new Embed(client, {
            title: "🔒 Register Your Account",
            description: `Click [here](${OAuth2URL}) to get your access code. Once you have your code, use \`/authenticate\` to log in.`,
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
