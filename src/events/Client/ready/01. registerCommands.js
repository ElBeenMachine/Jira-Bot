const areCommandsDifferent = require("#utils/commands/areCommandsDifferent.js");
const getApplicationCommands = require("#utils/commands/getApplicationCommands.js");
const getLocalCommands = require("#utils/commands/getLocalCommands.js");
const { testServer } = require("#config.js");
const client = require("#index.js");

client.on(__dirname.replace(/\\/g, "/").split("/").pop(), async () => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name,
                testServer
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🔴 | Deleted command "${name}"`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                    console.log(`🔵 | Edited command "${name}"`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(
                        `🟠 | Skipping registration of command "${name}" as it is flagged as deleted.`
                    );
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                console.log(`🟢 | Registered command "${name}"`);
            }
        }
    } catch (error) {
        console.log(
            `🔴 | There was an error while registering a command: ${error.message}`
        );
    }
});
