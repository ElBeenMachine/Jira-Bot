const client = require("#index.js");
const sqlite = require("sqlite3").verbose();
const fs = require("fs");

client.on(__dirname.replace(/\\/g, "/").split("/").pop(), (client) => {
    // Make database directory if it doesn't exist
    if (!fs.existsSync("./src/database")) {
        fs.mkdirSync("./src/database");
    }
});
