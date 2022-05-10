import { Plugin } from "aliucord/entities";
import { getByProps, MessageActions } from 'aliucord/metro';

export default class AtSomeone extends Plugin {
    public async start() {
        const { getMemberIds } = getByProps("getMemberIds");
        
        this.commands.registerCommand({
            name: "@someone",
            description: "@someone randomly on the server",
            options: [],
            execute(_, ctx) {
                const members = getMemberIds(ctx.channel.guildId);
                const member = members[Math.floor(Math.random() * members.length)]
                MessageActions.sendMessage(ctx.channel.id, {content: `<@${member}>`})
            }
        });
    }
}
