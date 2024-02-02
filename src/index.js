require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    ActivityType,
} = require("discord.js");

const eventHandler = require("#handlers/eventHandler.js");

const client = new Client({
    shards: "auto",
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    presence: {
        status: "online",
        activities: [
            {
                name: "JIRA",
                type: ActivityType.Watching,
            },
        ],
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
});

// Export the client
module.exports = client;

// Start the event handler
eventHandler(client);

// Log in to discord
client.login(process.env.TOKEN);
