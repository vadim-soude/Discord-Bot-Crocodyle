module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} a démmarer ! Reytz#9806`);
        //client.channels.cache.get('').send('debug');
        
    }
}

