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

                // Get the site
                const data = await res.json();
                const site = data[0].url;

                // Save the token
                client.db.run(
                    "INSERT INTO users (id, accessToken, site) VALUES (?, ?, ?)",
                    [interaction.user.id, token, site]
                );

                // Send a success message
                const authEmbed = new Embed(client, {
                    title: "🔑 You are now authenticated",
                    description:
                        "Use `/help` for more information on your available commands.",
                });

                await interaction.reply({
                    embeds: [authEmbed],
                    ephemeral: true,
                });
            });
        }
    }
);
