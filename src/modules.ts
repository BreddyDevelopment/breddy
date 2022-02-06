import { Message } from "discord.js";
import { CommandModule } from "./command";
import { InfoModule } from "./info-module";
import { BotModule, ModuleManager } from "./module";

export function setModules(manager:ModuleManager) {
    const commandsModule = new CommandModule(manager, 'commands', "Commands", ">");
    commandsModule.description=`A module powering all the commands of Breddy.`;
    manager.addModule(commandsModule)
    const infoModule = new InfoModule(manager, 'info', "Breddy Info");
    infoModule.description=`A module for general information about the Breddy bot, as well
    information to get started.`
    manager.addModule(infoModule);

    const reactions = new BotModule(manager, 'reaction_fun', "Breddy Reaction fun!", false, true);
    reactions.description="A module that reacts with a Breddy emoji to messages containing \"Breddy\".";
    reactions.setCallbacks([
        {name:'messageCreate', call:function(msg:Message) {
            console.log(`new message: ${msg.content}`);
            if(/breddy/.test(msg.content)) {
                msg.react('<:breddy:914473334232739851>');
            }
        }}
    ]);
    manager.addModule(reactions);

    
}