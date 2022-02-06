import {BotModule, ModuleManager} from './module';
import { CommandArgument, CommandModule } from './command';
import * as dsc from 'discord.js'

function format(seconds:number){
    function pad(s:number){
      return s+"";
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);
  
    //  return pad(hours) + ' hours, ' + pad(minutes) + ' minutes and ' + pad(seconds) + ' seconds';

    var timestamp=""

    var h = pad(hours);
    var m = pad(minutes);
    var s = pad(seconds);

    if(hours>0) {
        timestamp += h+"h "
    }
    if(minutes>0) {
        timestamp += m+"m "
    }
    if(seconds>0) {
        timestamp += s+"s"
    }

    return timestamp;
  }
  
export class InfoModule extends BotModule {
    startTime:number;

    constructor(manager:ModuleManager, id:string, name:string, active:boolean=true) {
        super(manager, id, name, active);

        this.startTime=Date.now();
        const commands = manager.getModuleById("commands") as CommandModule

        this.setCallbacks([
            {
                name:"messageCreate",
                call:(msg:dsc.Message)=>{
                    console.log(`hahha bnew message: ${msg.content}`);
                    if(this.manager.client.user&&commands) {
                        if(msg.content.includes(this.manager.client.user.id)){
                            msg.reply(`Hello there! My prefix here is \`${commands.prefix}\`.`)
                        }
                    }
                    else msg.channel.send('Error! "commands" module not found.')
                }
            },
        ]);

        commands.createCommand(this, "ping", [], 0, this.ping, ["latency", "thebreddyping🧐"], ":ping_pong: Shows bot latency.");
        commands.createCommand(this, "help", [{
            name:"module_name",
            description:"The name (ID) of the module you are trying to get help for."
        }], 0, this.help, ["moduleinfo"], "A command to help you with using Breddy.")
        commands.createCommand(this, "uptime", [], 0, this.uptime, [], "(wip) Shows for how long <:breddy:914473334232739851> **Breddy** has been running.")
        commands.createCommand(this, "cmdhelp", [{
            name:"cmd_name",
            description:"Name of the command for which you need info."
        }], 1, this.cmdhelp, ["command", "cmd"], "Displays information for the command named `cmd_name`");
    }

    cmdhelp = (msg:dsc.Message, args:Map<string, string>) => {
        const commands = this.manager.getModuleById('commands') as CommandModule;
        const cmd_name = args.get("cmd_name");
        if(cmd_name)
        {
            const cmd = commands.getCommandByName(cmd_name);
            if(cmd) {
                let desc="";
                if(!(cmd.description||cmd.args.length>0)) {
                    desc = "This module has no description and no commands." 
                }
                else {
                    desc = (cmd.description||"This module has no description.");
                    if(cmd.args.length==0) desc+="\n\nThis module has no commands."
                }

                let embed = new dsc.MessageEmbed()
                    .setColor('#02D2BC')
                    .setTitle(`Help for \`${commands.prefix+cmd.name}\``)
                    .setDescription(desc)

                for(let i=0; i<cmd.args.length; i++) {
                    const required = cmd.requiredArgs>i;
                    let argName;

                    if(required) argName = `\`<${cmd.args[i].name}>\``
                    else         argName = `\`[${cmd.args[i].name}]\``

                    embed.addField(argName, cmd.args[i].description||"No description.");
                }
                if(cmd.aliases.length>0) {
                    let list;
                    for(let i=0; i<cmd.aliases.length; i++) {
                        
                    }
                }

                msg.reply({embeds:[embed]})
            }
            else {
                let embed = new dsc.MessageEmbed()
                    .setColor("#eb4034")
                    .setTitle("No such command")
                    .setDescription("We couldn't find the command you were looking for.")
                
                msg.reply({embeds:[embed]})
            }
        }
    }

    ping = (msg:dsc.Message)=> {
        msg.channel.send(`:ping_pong: Pong! My latency is ${Math.round(this.manager.client.ws.ping)}ms.`)
    }
    help = (msg:dsc.Message, args:Map<string, string>)=>{
        const commands = this.manager.getModuleById("commands") as CommandModule;
        if(commands)
        {
            const mdlName = args.get("module_name");
            var mdl;

            if(mdlName)
            {
                mdl = this.manager.getModuleById(mdlName);
                if(mdl) {
                    let cmds = commands.getModuleCommands(mdlName);
                    let desc="";
                    if(!(mdl.description||cmds)) {
                        desc = "This module has no description and no commands." 
                    }
                    else {
                        desc = (mdl.description||"This module has no description.");
                        if(!cmds) desc+="\n\nThis module has no commands."
                    }

                    let embed = new dsc.MessageEmbed()
                        .setColor('#02D2BC')
                        .setTitle(`Help for ${mdl.name} (\`${mdl.id}\`)${(mdl.hidden) ? ' (hidden)' : ''}`)
                        .setDescription(desc)

                    if(cmds) {
                        cmds.forEach((cmd)=>{
                                embed.addField(
                                    `\`${commands.getCommandSyntax(cmd)}\``,
                                    cmd.description||'',
                                )
                        })
                    }

                    msg.reply({embeds:[embed]})
                } else {    
                    msg.reply(`<:red_tick:895371250115940392> That module does not exist, to see a full list of modules, type \`${commands.prefix}help\`.`);
                }
            }
            else {
                let embed = new dsc.MessageEmbed()
                    .setColor('#02D2BC')
                    .setTitle('Breddy Help')
                    .setDescription('Here are all the modules in Breddy:');

                this.manager.modules.forEach((mdl)=>{
                    if(!mdl.hidden) embed.addField(mdl.name, `\`${commands.prefix}help ${mdl.id}\` ${mdl.description||""}`, true);
                })
                msg.reply({embeds:[embed]});
            }
        }
    }
    uptime = (msg:dsc.Message)=>{
        msg.reply(`<:breddy:914473334232739851> **Breddy** has been up for **${format(process.uptime())}**, since <t:${Math.floor(this.startTime)}>`);
    }
}