const client = require("../../../index");
const Embed = require("../../../structures/Embed");

client.on(
    __dirname.replace(/\\/g, "/").split("/").pop(),
    async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId == "jiraAuthModal") {
            const token = interaction.fields.getTextInputValue("tokenInput");

            fetch(
                "https://api.atlassian.com/oauth/token/accessible-resources",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            ).then(async (res) => {
                if (!res.ok) {
                    const errorEmbed = new Embed(client, {
                        title: "An error has occurred",
                        description: "Your token was invalid",
                        color: 0xff0000,
                    });

                    return await interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true,
                    });
                }

                // Save the token
                await interaction.reply({
                    content: `Your token is: \`\`\`${token}\`\`\``,
                    ephemeral: true,
                });
            });
        }
    }
);
