const Embed = require("#global/structures/Embed.js");

const colours = {
    created: 0x008000, // GREEN
    updated: 0xffff00, // YELLOW
    deleted: 0xff0000, // RED
    started: 0x0000ff, // BLUE
    finished: 0x800080, // PURPLE
    commented: 0xffffff, // WHITE
};

function createResponseEmbed(client, body) {
    const user = body.user;
    const eventType = body.webhookEvent;
    const issue = body.issue;

    // Get relevant information from the user
    const name = user.displayName;
    const avatar = user.avatarUrls["48x48"];

    // Get relevant information from the issue
    const issueKey = issue.key;
    const assignee = issue.fields.assignee;
    const description = issue.fields.description;
    const summary = issue.fields.summary;
    const status = issue.fields.status.name;

    let embed = new Embed(client)
        .setAuthor({
            name,
            iconURL: avatar,
        })
        .addFields([
            {
                name: "Assignee",
                value: `\`${assignee ? assignee.displayName : "Unassigned"}\``,
                inline: true,
            },
            {
                name: "Status",
                value: `\`${status}\``,
                inline: true,
            },
            {
                name: "Summary",
                value: `\`${summary}\``,
                inline: false,
            },
        ]);

    if (description) {
        embed.setDescription(description);
    }

    switch (eventType) {
        case "jira:issue_created":
            embed
                .setTitle(`Issue ${issueKey} Created by ${name}`)
                .setColor(colours.created);
            return embed;
        case "jira:issue_updated":
            embed
                .setTitle(`Issue ${issueKey} Updated by ${name}`)
                .setColor(colours.updated);

            return embed;
        default:
            return null;
    }
}

module.exports = createResponseEmbed;
