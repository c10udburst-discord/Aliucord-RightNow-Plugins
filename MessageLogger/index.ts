import { Plugin } from "aliucord/entities";
import { FluxDispatcher, MessageStore, UserStore } from "aliucord/metro";
import { before } from "aliucord/utils/patcher";

export default class MessageLogger extends Plugin {
    public async start() {
        before(FluxDispatcher, "dispatch", (ctx, event) => {
            if (event.type === "MESSAGE_UPDATE" && event?.message?.content) {
                if (UserStore.getCurrentUser().id === event?.message?.author?.id) return;

                const original = MessageStore.getMessage(event.message.channel_id, event.message.id);
                if (original?.content === undefined) return;

                event.message.content = `~~${original.content.replace(/~/g, "")}~~ [edited]\n${event.message.content}`
            }

            else if (event.type === "MESSAGE_DELETE") {
                const original = MessageStore.getMessage(event.channelId, event.id);
                if (original === undefined) return;
                if (UserStore.getCurrentUser().id === original.author?.id) return;

                event.type = "MESSAGE_UPDATE"

                event.message = Object.assign({}, original)

                if (event?.message?.content && !event.message.content.endsWith(" [deleted]"))
                    event.message.content = `~~${event.message.content.replace(/~/g, "")}~~ [deleted]`
            }
        })
    }
}