module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message){
        if (message.content != "") {
            if (message.member.roles.cache.some(role => role.id === process.env.ROLE_JAUNE) && message.content.includes(process.env.EMOTE_ROUGE)) {
                if (message.member.moderatable == true && !message.member.roles.cache.some(role => role.id === process.env.ROLE_MODO)) {
                    message.reply('Traitre jaune ! \u00C0 dans 10 minutes');
                    message.member.timeout(10 * 60 * 1000, "Traitre jaune");
                } else {
                    message.reply('Traitre jaune !');
                }
             }
            if (message.member.roles.cache.some(role => role.id === process.env.ROLE_ROUGE) && message.content.includes(process.env.EMOTE_JAUNE)) {
                if (message.member.moderatable == true && !message.member.roles.cache.some(role => role.id === process.env.ROLE_MODO)) {
                    message.reply('Traitre rouge ! \u00C0 dans 10 minutes');
                    message.member.timeout(10 * 60 * 1000, "Traitre rouge");
                } else {
                    message.reply('Traitre rouge !');
                }
            }
        }
    }
}
    
