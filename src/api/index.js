require("dotenv").config();
const express = require("express");
const app = express();
const {
    Client,
    ActivityType,
    GatewayIntentBits,
    Partials,
} = require("discord.js");
const fs = require("fs");
const sqlite = require("sqlite3").verbose();

const createResponseEmbed = require("./createResponseEmbed");

// Create a new discord client
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

// Log when discord client is ready
client.on("ready", () => {
    console.log(`🟢 | API logged in as ${client.user.username}`);
});

// Make database directory if it doesn't exist
if (!fs.existsSync("./db")) {
    fs.mkdirSync("./db");
}

// Create and connect to the sqlite database
client.db = new sqlite.Database("./db/database.db", (err) => {
    if (err) {
        console.error(`🔴 | ${err}`);
        exit(1);
    }
    console.log("🟢 | API Connected to the database");
});

// Log in to discord
client.login(process.env.TOKEN);

app.use(express.json());

function getChannels(projectID) {
    return new Promise((resolve, reject) => {
        client.db.all(
            "SELECT * FROM projects WHERE projectID = ?",
            [projectID],
            (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

app.post("/jira/webhook", async (req, res) => {
    // Get channel IDs from database matching the project ID
    const channels = await getChannels(req.body.issue.fields.project.id);

    if (channels.length === 0)
        return res.status(404).json({ message: "Channel not found" });

    const embed = createResponseEmbed(client, req.body);

    if (embed) {
        for (const item of channels) {
            const channel = client.channels.cache.get(item.channelID);
            if (!channel) {
                console.error(
                    `🔴 | Channel with ID ${item.channelID} not found, skipping`
                );
            } else {
                console.log(`🟢 | Sending embed to channel ${channel.id}`);
                await channel.send({ embeds: [embed] });
            }
        }
    }

    res.send("Webhook received!");
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("🟢 | Server is running on port 3000");
});
