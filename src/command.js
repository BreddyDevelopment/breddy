"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CommandModule = void 0;
var module_1 = require("./module");
var CommandModule = /** @class */ (function (_super) {
    __extends(CommandModule, _super);
    function CommandModule(manager, id, name, prefix, active) {
        if (active === void 0) { active = true; }
        var _this = _super.call(this, manager, id, name, active) || this;
        _this.commandList = [];
        _this.prefix = prefix;
        _this.setCallbacks([{
                name: 'messageCreate',
                call: function (msg) {
                    if (!msg.author.bot) {
                        _this.commandList.forEach(function (cmd) {
                            if (msg.content == "".concat(_this.prefix).concat(cmd.name)) {
                                if (cmd.owner.active)
                                    cmd.call(msg);
                            }
                        });
                    }
                }
            }]);
        return _this;
    }
    CommandModule.prototype.createCommand = function (identity, name, call) {
        this.commandList.push({
            owner: identity,
            name: name,
            call: call
        });
    };
    return CommandModule;
}(module_1.BotModule));
exports.CommandModule = CommandModule;
