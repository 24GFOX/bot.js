const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = "NTY2ODAzNDgwNDY4MTI3NzY1.XMZN6Q.BhGEbs7o6GKLD6av-rC1rwCa0VQ";

client.login(token)

var cookie = "842192013730202FE0DDB0D236663AB880EF0FFE831A01F366EF1AA62C192E258747F9897EB1C295B3F98E9F55A71CDEAB6E2750B1C6D32564601BE468F1F1CF4F2B6D52C14566C7EB65407A9211BD8FEE7727251289F8ED0BDA358B5980D14A194E3A89E6A92D1E404E12EB5D16BE047ACBAC11528DB4F0F3DC8FC695CC99A3F0E8F328C0F9CB8E501536BD444B4E1DE19F19ACF2A1B2B69942AB115EED38F73ACF7956D5FFA3A930B91A6FBB7AAEDBC054D1213A74DFA255ACA72CAD4517DBAC68459F08D792B95883B81DA5A61329578B2E52052969A21B0082FC9B4253A49AE634D470B59F44EE99E8103B71AF1AE77F63BD536C30FA72A7DADAA3CFEEFAA7129989B36794EC03B54DDA2BD05A21037F9C2B207B46E6D2DCAE5AF1A16848F8CEBA54E4A6B840868BCA5F01F7968A259DBBD3"
var prefix = '#';
var groupId = 4776725;
var maximumRank = 255;

function login() {
    return roblox.cookieLogin(cookie);
}

login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('rank', message)){
       if(!message.member.roles.some(r=>["Discord Mod"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
        return message.reply("You can't use this command.");
        var username = args[1]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (!rankIdentifier) return message.channel.send("Please enter a rank");
        if (username){
            message.channel.send(`Checking ROBLOX for ${username}`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if(maximumRank <= rank){
                        message.channel.send(`${id} is rank ${rank} and not promotable.`)
                    } else {
                        message.channel.send(`${id} is rank ${rank} and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank to ${newRole.Name}`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
           });
       } else {
           message.channel.send("Please enter a username.")
       }
       return;
   }
})