const client = require("#index.js");
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
        console.log("🟢 | Connected to the database");
    });

    /**
     * Create tables if they don't exist
     */

    // Create the guilds table
    client.db.run(
        "CREATE TABLE IF NOT EXISTS guilds (id TEXT PRIMARY KEY, name TEXT UNIQUE)"
    );

    // Create the projects table
    client.db.run(
        "CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, channelID TEXT NOT NULL, guild TEXT NOT NULL, FOREIGN KEY(guild) REFERENCES guilds(id))"
    );

    // Create the users table
    client.db.run(
        "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, accessToken TEXT NOT NULL UNIQUE, refreshToken TEXT NOT NULL UNIQUE, expires TEXT NOT NULL)"
    );
});
