import {Client, Message, Intents, DiscordAPIError} from 'discord.js'
import {ModuleManager} from './module';
import {CommandModule} from './command';

if(process.argv.length>2) {
    const token:string=eval(process.argv[2]);
    if(token) { 
        const client=new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

        const manager=new ModuleManager(client);

        const simpleModule = manager.createModule('simple', "Simple Module");
        simpleModule.setCallbacks([
            {name:'messageCreate', call:function(msg:Message) {
                console.log(`new message: ${msg.content}`);
                if(/breddy/.test(msg.content)) {
                    msg.react('<:breddy:914473334232739851>');
                }
            }}
        ]);

        const commands = new CommandModule(manager, 'commands', "Commands", ">");
        manager.addModule(commands);

        const foundCommands:any = manager.getModuleById('commands');
        if(foundCommands) {
            foundCommands.createCommand(commands, "ping", (msg:Message)=>{
                msg.reply(`:ping_pong: Pong!\n\ndebug:your message reads ${msg.content}`);
            });
        }

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