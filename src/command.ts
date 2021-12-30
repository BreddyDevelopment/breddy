import {BotModule, ModuleManager} from './module';
import {Message} from 'discord.js'

export interface Command {
    readonly owner:BotModule;
    readonly name:string;
    //parameters would go somewhere here, not yet implemented

    readonly call:Function;
}

export class CommandModule extends BotModule {
    private commandList:Command[];
    prefix:string;
    constructor(manager:ModuleManager, id:string, name:string, prefix:string, active:boolean=true) {
        super(manager, id, name, active);
        this.commandList=[];
        this.prefix=prefix;

        this.setCallbacks([{
            name:'messageCreate',
            call:(msg:Message)=>{
                if(!msg.author.bot) {
                    this.commandList.forEach((cmd)=>{
                        if(msg.content==`${this.prefix}${cmd.name}`) {
                            if(cmd.owner.active) cmd.call(msg);
                        }
                    });
                }
            }
        }]);
    }
    createCommand(identity:BotModule, name:string, call:Function)
    {
        this.commandList.push({
            owner:identity,
            name:name,
            call:call
        });
    }

}