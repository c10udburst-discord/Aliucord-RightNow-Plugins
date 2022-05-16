import { Plugin } from "aliucord/entities";
import { MessageActions, GuildMemberStore } from 'aliucord/metro';

export default class AtSomeone extends Plugin {
    public async start() {
        
        this.commands.registerCommand({
            name: "@someone",
            description: "@someone randomly on the server",
            options: [],
            execute(_, ctx) {
                const members = GuildMemberStore.getMemberIds(ctx.channel.guildId.toString());
                const member = members[Math.floor(Math.random() * members.length)]
                MessageActions.sendMessage(ctx.channel.id, {content: `<@${member}>`})
            }
        });
    }
}
