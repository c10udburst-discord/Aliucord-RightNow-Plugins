import { Plugin } from "aliucord/entities";
import { before } from "aliucord/utils/patcher";
import { FluxDispatcher, MessageStore, ChannelStore, Constants } from "aliucord/metro";

export default class MessageLogger extends Plugin {
    public async start() {
        const skipLog = (msg) => {
            if (!msg) return true;
            if (msg.flags & Constants.MessageFlags.EPHEMERAL) return true;

            return false;
        }
    

        before(FluxDispatcher, "dispatch", ctx => {
            const [args] = ctx.args;

            if (args.type === "MESSAGE_DELETE") {
                const msg = MessageStore.getMessage(args.channelId, args.id);

                const wasEdited = msg?.editedTimestamp && !msg.editedTimestamp._isValid;
                
                if (!wasEdited && skipLog(msg)) return;

                const content = wasEdited ? msg.content : msg?.content + " `[deleted]`";

                ctx.args[0].type = "MESSAGE_UPDATE";
                ctx.args[0].message = {
                    ...msg,
                    edited_timestamp: "invalid_timestamp",
                    content,
                    guild_id: ChannelStore.getChannel(args.channelId)?.guild_id,
                    flags: msg.flags | Constants.MessageFlags.EPHEMERAL
                }
            }

            else if (args.type === "MESSAGE_UPDATE") {
                const msg = MessageStore.getMessage(args.message.channel_id, args.message.id);
                if (skipLog(msg)) return;

                const newContent = args.message.content;

                if (newContent === undefined) return;
                
                ctx.args[0].message.content = msg.content + " `[edited]`\n" + newContent;
            }
        });
    }
}
