console.log("System start");

require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent","GuildMembers",""] });

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in !`);
});

client.on('messageCreate', (message) => {
    if (message.content != "") {

        console.log(message.content);

        if (message.member.roles.cache.some(role => role.id === process.env.ROLE_JAUNE) && message.content.includes(process.env.EMOTE_ROUGE)) {
            if (message.member.moderatable == true) {
                message.reply('Traitre jaune ! \u00C0 dans 10 minutes');
                message.member.timeout(10 * 60 * 1000, "Traitre jaune");
            } else {
                message.reply('Traitre jaune !');
            }
        }

        if (message.member.roles.cache.some(role => role.id === process.env.ROLE_ROUGE) && message.content.includes(process.env.EMOTE_JAUNE)) {
            
            if (message.member.moderatable == true) {
                message.reply('Traitre rouge ! \u00C0 dans 10 minutes');
                message.member.timeout(10 * 60 * 1000, "Traitre rouge");
            } else {
                message.reply('Traitre rouge !');
            }
        }
        
    }
});


client.login(process.env.DISCORD_BOT_TOKEN);