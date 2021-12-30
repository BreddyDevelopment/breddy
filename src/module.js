"use strict";
exports.__esModule = true;
exports.BotModule = exports.ModuleManager = void 0;
var ModuleManager = /** @class */ (function () {
    function ModuleManager(client, modules) {
        if (modules === void 0) { modules = []; }
        this.client = client;
        this.modules = modules;
    }
    ModuleManager.prototype.createModule = function (id, name, active) {
        if (active === void 0) { active = true; }
        var module = new BotModule(this, id, name, active);
        this.modules.push(module);
        return module;
    };
    ;
    ModuleManager.prototype.addModule = function (module) {
        this.modules.push(module);
    };
    ModuleManager.prototype.getModuleById = function (id) {
        var found = false;
        for (var i = 0; i < this.modules.length; i++) {
            if (this.modules[i].id == id) {
                return this.modules[i];
            }
        }
        return undefined;
    };
    return ModuleManager;
}());
exports.ModuleManager = ModuleManager;
var BotModule = /** @class */ (function () {
    function BotModule(manager, id, name, active) {
        if (active === void 0) { active = true; }
        this.manager = manager;
        this.id = id;
        this.name = name;
        this.active = active;
    }
    BotModule.prototype.setCallbacks = function (map) {
        var _this = this;
        map.forEach(function (callback) {
            _this.manager.client.on(callback.name, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (_this.active) {
                    callback.call.apply(callback, args);
                }
            });
        });
    };
    return BotModule;
}());
exports.BotModule = BotModule;
