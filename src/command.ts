import {BotModule, ModuleManager} from './module';
import {Message} from 'discord.js'

const cmdBlacklist = [
    "916753164378730518",
    "342208062867636226"
]

interface EmbedField {
    name:string,
    value:string,
    inline?:boolean
}

export interface CommandArgument {
    readonly name:string,
    readonly description?:string
}

export interface Command {
    readonly owner:BotModule;
    readonly name:string;    
    readonly description?:string;
    readonly aliases:string[];
    readonly args:CommandArgument[];
    readonly requiredArgs:number;
    readonly call:Function;
}

export class CommandModule extends BotModule {
    private commandList:Command[];
    private commandMap:Map<string, Command[]>;
    prefix:string;
    constructor(manager:ModuleManager, id:string, name:string, prefix:string, active:boolean=true) {
        super(manager, id, name, active);
        this.commandList=[];
        this.commandMap=new Map<string, Command[]>();
        this.prefix=prefix;
        this.hidden=true;

        this.setCallbacks([{
            name:'messageCreate',
            call:(msg:Message)=>{
                if(!msg.author.bot) {
                    if(msg.content.startsWith(this.prefix))
                    {
                        this.commandList.forEach((cmd)=>{
                            if( msg.content==(this.prefix+cmd.name)||
                                msg.content.startsWith(this.prefix+cmd.name+" ")){
                                if(!cmdBlacklist.includes(msg.author.id))
                                {
                                    this.iaexec(cmd, msg);
                                }
                                else msg.reply("youre blacklisted bozo");
                            }
                        });
                    }
                }
            }
        }]);
    }
    //iaexec = Identify Arguments & EXECute
    private iaexec(cmd:Command, msg:Message) {
        const commandHead = `${this.prefix}${cmd.name}`
        const separated = msg.content.slice(commandHead.length+1).split(" ");
        this.executeCommand(cmd, msg, (separated.length==1&&separated[0]=="")?[]:separated);
    }
    //args has length of actual arguments passed
    // so if i do ">test abc defg", args.length=2
    private executeCommand(cmd:Command, msg:Message, args:string[]) {
        //msg.reply(`argument array: ${JSON.stringify(args)}`);
        if(cmd.owner.active) {
            let map = new Map<string, string>();
            if(args.length<=cmd.args.length&&args.length>=cmd.requiredArgs) {
                for(let i:number=0; i<args.length; i++) {
                    map.set(cmd.args[i].name, args[i]);
                }
                cmd.call(msg, map);
            }
            else if(args.length>cmd.args.length) {
                msg.reply("too many arguments");
            }
            else if(args.length<cmd.requiredArgs) {
                msg.reply("missing required arguments");
                let embed:any= {
                    title: "Failed to execute your command",
                    description: "That command failed to execute because you missed required argument(s):",
                    color: "#eb4034",
                    fields:[]
                }
                for(let i:number=args.length; i<cmd.requiredArgs; i++) {
                    embed.fields.push({
                        name:`\`${cmd.args[i].name}\``,
                        value:cmd.description||"No description"
                    })
                }
                msg.reply({embeds:[embed]});
            }
        }
    }
    getCommandSyntax(cmd:Command) {
        var syntax = `${this.prefix}${cmd.name}`;
        for(let i:number=0; i<cmd.args.length; i++) {
            let required = i<cmd.requiredArgs;
            syntax+=((required)?' <':' [') + 
                    cmd.args[i].name +
                    ((required)?'>':']') 
        }

        return syntax;
    }

    createCommand(identity:BotModule, name:string, args:CommandArgument[], requiredArgs:number, call:Function, aliases:string[], description?:string)
    {
        const cmd = {
            owner:identity,
            name:name,
            description:description,
            aliases:aliases,
            args:args,
            requiredArgs:requiredArgs,
            call:call
        };
        this.commandList.push(cmd);
        if(this.commandMap.has(identity.id)){
            this.commandMap.get(identity.id)?.push(cmd);            
        }
        else this.commandMap.set(identity.id, [cmd]);
    }

    getModuleCommands(id:string) {
        var tbr =(this.commandMap.has(id)) ? this.commandMap.get(id) : undefined;
        if(this.commandMap.has(id))
        {
            console.log(`the module with id ${id} has been looked for and it has commands`)
        }
        console.log(`the module with it ${id} does not exist in command map`);
        return tbr;
    }

    getCommandByName(name:string) {
        var cmds = Array.from(this.commandMap.values());
        for(let i=0; i<cmds.length; i++) {
            for(let j=0; j<cmds[i].length; j++) {
                var cmd=cmds[i][j];
                if(cmd.name==name) return cmd;
            }
        }
        return undefined;
    }

}