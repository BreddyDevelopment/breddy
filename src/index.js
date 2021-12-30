"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var module_1 = require("./module");
var command_1 = require("./command");
if (process.argv.length > 2) {
    var token = eval(process.argv[2]);
    if (token) {
        var client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
        var manager = new module_1.ModuleManager(client);
        var simpleModule = manager.createModule('simple', "Simple Module");
        simpleModule.setCallbacks([
            { name: 'messageCreate', call: function (msg) {
                    console.log("new message: ".concat(msg.content));
                    if (/breddy/.test(msg.content)) {
                        msg.react('<:breddy:914473334232739851>');
                    }
                } }
        ]);
        var commands = new command_1.CommandModule(manager, 'commands', "Commands", ">");
        manager.addModule(commands);
        var foundCommands = manager.getModuleById('commands');
        if (foundCommands) {
            foundCommands.createCommand(commands, "ping", function (msg) {
                msg.reply(":ping_pong: Pong!\n\ndebug:your message reads ".concat(msg.content));
            });
        }
        client.once('ready', function () {
            console.log('The bot is now ready.');
        });
        client.on('messageCreate', function (msg) {
            var _a;
            if (msg.content.toLowerCase() == 'hi breddy') {
                msg.reply("hello ".concat((_a = msg.member) === null || _a === void 0 ? void 0 : _a.displayName));
            }
        });
        client.login(token);
    }
    else {
        console.log('No token was evaluated. The bot cannot start.');
    }
}
else {
    console.log('Please provide a JS expression so the bot token can be retrieved');
}
