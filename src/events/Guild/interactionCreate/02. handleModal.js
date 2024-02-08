const client = require("../../../index");
const Embed = require("../../../structures/Embed");

client.on(
    __dirname.replace(/\\/g, "/").split("/").pop(),
    async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId == "jiraAuthModal") {
            const code = interaction.fields.getTextInputValue("codeInput");

            const tokenData = await fetch(
                "https://auth.atlassian.com/oauth/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        grant_type: "authorization_code",
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code,
                        redirect_uri: process.env.REDIRECT_URI,
                    }),
                }
            );

            if (tokenData.status != 200) {
                const errorEmbed = new Embed(client, {
                    title: "An error has occurred",
                    description: "Your code was invalid",
                    color: 0xff0000,
                });

                return await interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            }

            const tokens = await tokenData.json();

            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

            const token = tokens.access_token;
            const refreshToken = tokens.refresh_token;

            // Save the token
            client.db.run(
                "INSERT INTO users (id, accessToken, refreshToken, expires) VALUES (?, ?, ?, ?)",
                [
                    interaction.user.id,
                    token,
                    refreshToken,
                    expiresAt.toISOString(),
                ]
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
        }
    }
);
