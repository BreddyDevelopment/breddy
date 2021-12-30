import * as dsc from 'discord.js'


export interface Callback {
    name:string;
    call:Function;
}

export type CallbackMap = Callback[];

export class ModuleManager {
    client:dsc.Client;
    modules:BotModule[];
    constructor(client:dsc.Client, modules:BotModule[]=[]) {
        this.client=client;
        this.modules=modules;
    }
    createModule(id:string, name:string, active:boolean=true):BotModule {
        var module = new BotModule(this, id, name, active);
        this.modules.push(module);
        return module;
    };
    addModule(module:BotModule) {
        this.modules.push(module);
    }
    getModuleById(id:string):BotModule|undefined {
        let found=false;
        for(var i:number=0; i<this.modules.length; i++)
        {
            if(this.modules[i].id==id) {
                return this.modules[i]; 
            }
        }
        return undefined;
    }
}

export class BotModule {
    manager:ModuleManager;
    readonly id:string;
    name:string;
    active:boolean;
    constructor(manager:ModuleManager, id:string, name:string, active:boolean=true) {
        this.manager=manager;
        this.id=id;
        this.name=name;
        this.active=active;
    }
    setCallbacks(map:CallbackMap) {
        map.forEach((callback)=>{
            this.manager.client.on(callback.name, (...args)=>{
                if(this.active) {
                    callback.call(...args);
                }
            });
        })
    }
        
}