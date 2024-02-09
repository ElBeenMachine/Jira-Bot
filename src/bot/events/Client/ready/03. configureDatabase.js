const client = require("#bot/index.js");
const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const { exit } = require("process");

client.on(__dirname.replace(/\\/g, "/").split("/").pop(), (client) => {
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
        console.log("🟢 | Bot Connected to the database");
    });

    /**
     * Create tables if they don't exist
     */

    // Create the tracking table
    client.db.run(
        "CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, projectID TEXT NOT NULL, guildID TEXT NOT NULL, channelID TEXT NOT NULL)"
    );

    // Create the users table
    client.db.run(
        "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, accessToken TEXT NOT NULL UNIQUE, refreshToken TEXT NOT NULL UNIQUE, expires TEXT NOT NULL)"
    );
});
