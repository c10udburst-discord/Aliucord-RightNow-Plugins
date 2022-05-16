import { Plugin } from "aliucord/entities";
import { getByProps } from "aliucord/metro";

export default class Token extends Plugin {
    public async start() {
        const ClydeUtils = getByProps("sendBotMessage");

        this.commands.registerCommand({
            name: "token",
            description: "Get your token",
            options: [],
            execute(_, ctx) {
                ClydeUtils.sendBotMessage(ctx.channel.id, getByProps("getToken").getToken());
            }
        });
    }
}