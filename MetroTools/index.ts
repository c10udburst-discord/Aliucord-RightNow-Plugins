import { ApplicationCommandOptionType } from "aliucord/api/Commands";
import { Plugin } from "aliucord/entities";
import { getByProps, getModule } from "aliucord/metro";

export default class MetroTools extends Plugin {
    public async start() {
        const ClydeUtils = getByProps("sendBotMessage");
        try {
            this.commands.registerCommand({
                name: "findprops",
                description: "Find module by props.",
                options: [ // using ApplicationCommandOptionType breaks it
                    {
                        name: "query",
                        description: "What to search for. Use space for multiple props.",
                        required: true,
                        type: 3 // string
                    },
                    {
                        name: "exact",
                        description: "Whether to match exactly or search for substrings",
                        required: false,
                        type: 5 // bool
                    }
                ],
                execute(args, ctx) {
                    let query = args[0].value as string;
                    let exact = args[1]?.value as boolean || false;

                    var module: any = null;
                    if (exact) {
                        module = getByProps(...query.split(/\s/g));
                    } else {
                        module = getModule(m => {
                            const stringified = JSON.stringify(Object.keys(m));
                            return query.split(/\s/g).filter(keyword=>!stringified.includes(keyword)).length < 1;
                        })
                    }


                    if (module) {
                        const embed = {
                            type: 'rich',
                            title: "Found module",
                            color: 5814783,
                            fields: []
                        } as any;


                        Object.keys(module).forEach(prop => {
                            try {
                                var repr: string = "unknown";
                                let descriptor = Object.getOwnPropertyDescriptor(module, prop);
                                if (descriptor?.get) { repr = "getter" }
                                else {
                                    let value = module[prop]
                                    if (value instanceof Function) {
                                        //@ts-ignore
                                        repr = AliuHermes.getBytecode(value).split('\n', 1)[0];
                                    } else {
                                        repr = JSON.stringify(value);
                                    }
                                }
                                embed.fields.push({
                                    name: prop,
                                    value: repr
                                });
                            } catch (ex) {
                                embed.fields.push({
                                    name: prop,
                                    value: `${ex}`
                                })
                            }

                        })

                        ClydeUtils.sendBotMessage(ctx.channel.id, "", [embed]);
                    } else {
                        ClydeUtils.sendBotMessage(ctx.channel.id, "No module found :pensive:");
                    }
                }
            });
        } catch (ex) {
            this.logger.error(ex)
        }
    }
}