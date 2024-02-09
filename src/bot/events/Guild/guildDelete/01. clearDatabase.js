const client = require("#bot/index.js");
const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const { exit } = require("process");

client.on(__dirname.replace(/\\/g, "/").split("/").pop(), (guild) => {
    // Delete all projects from the database that are in the guild that was deleted
    client.db.run(
        "DELETE FROM projects WHERE guildID = ?",
        [guild.id],
        (err) => {
            if (err) {
                console.error(err);
            }
            console.log(
                `🟢 | Projects for guild ${guild.id} have been untracked`
            );
        }
    );
});
