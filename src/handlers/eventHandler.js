const getAllFiles = require("#utils/getAllFiles.js");
const path = require("path");

function eventHandler(client) {
    const categoryFolders = getAllFiles(
        path.join(__dirname, "..", "events"),
        true
    );

    for (const categoryFolder of categoryFolders) {
        const eventFolders = getAllFiles(path.join(categoryFolder), true);
        for (const eventFolder of eventFolders) {
            const events = getAllFiles(eventFolder);
            for (const event of events) {
                require(event);
            }
        }
    }
}

module.exports = eventHandler;
