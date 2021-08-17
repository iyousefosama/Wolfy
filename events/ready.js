module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        function randomStatus() {
            let status = ["🤖 Wolfy Bot", "🤖 w!help", "🤖 Poob Beep"]
            let rstatus = Math.floor(Math.random() * status.length);
        
            client.user.setActivity(status[rstatus], {type: "PLAYING"});
            }; setInterval(randomStatus, 5000)
            console.log(`🤖 ${client.user.username} is Online!`)
    }
}