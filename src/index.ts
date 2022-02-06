import {Client, Message, Intents, DiscordAPIError} from 'discord.js'
import {BotModule, ModuleManager} from './module';
import {CommandModule} from './command';
import { setModules } from './modules';

if(process.argv.length>2) {
    const token:string=eval(process.argv[2]);
    if(token) { 
        const client=new Client({
            intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            allowedMentions:{parse:['users']}
        });

        const manager=new ModuleManager(client);
        setModules(manager);        

        client.once('ready', ()=>{
            console.log('The bot is now ready.');
        });

        client.on('messageCreate', (msg:Message)=>{
            if(msg.content.toLowerCase()=='hi breddy') {
                msg.reply(`hello ${msg.member?.displayName}`);
            }
        })

        client.login(token);
    }
    else {
        console.log('No token was evaluated. The bot cannot start.');
    }
}
else {
    console.log('Please provide a JS expression so the bot token can be retrieved')
}