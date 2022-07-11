import { Plugin } from "aliucord/entities";
import { FluxDispatcher, MessageStore, SnowflakeUtils } from "aliucord/metro";
import { before } from "aliucord/utils/patcher";

function makeEmbed(message, url) {
    let embed: any = {}
    embed.id = `eml_${message.id}`
    embed.type = 'rich'
    embed.description = message.content
    embed.url = url
    embed.author = {
        name: message.author?.username,
        iconURL: `https://cdn.discordapp.com/avatars/${message.author?.id}/${message.author?.avatar}.png`
    }
    embed.color = (message.colorString && parseInt(message.colorString.slice(1), 16)) || 15885656
    embed.image = message?.attachments?.find(it=>it.content_type.startsWith("image/") && it.url) || message?.embeds?.find(it=>it?.image?.url)?.image;
    embed.fields = message.attachments?.map(it => {
        return {
            name: "",
            value: `:paperclip: [${it.filename}](${it.url})`,
            inline: true
        }
    })
    embed.timestamp = message.timestamp
    return embed
}

function makeEmbeds(message) {
    if (!message?.content) return [];

    const linkRe = /https?:\/\/(?:\w+\.)?discord(?:app)?\.com\/channels\/(\d{17,19}|@me)\/(\d{17,19})\/(\d{17,19})(?!>)/g
    
    let embeds: any[] = []
    let match: RegExpExecArray|null;
    while ((match = linkRe.exec(message?.content)) !== null) {
        const [url, guild_id, channel_id, id] = match
        const msg = MessageStore.getMessage(channel_id, id)
        if (!msg) continue;
        embeds.push(makeEmbed(msg, url))
    }
    return embeds
}

export default class EmbedMessageLinks extends Plugin {

    public async start() {
        before(FluxDispatcher, "dispatch", (ctx, event) => {
            if (event.type === "MESSAGE_UPDATE" && event.message) {
                const msgEmbeds = makeEmbeds(event?.message)
                if (!msgEmbeds) return;
                event.message.embeds = event.message.embeds?.filter(it=>!it.id || !it.id.startsWith("eml_")) || []
                event.message.embeds.push(...msgEmbeds)
                
            }

            else if (event.type === "MESSAGE_CREATE") {
                const msgEmbeds = makeEmbeds(event?.message)
                if (!msgEmbeds) return;
                event.message.embeds = event.message.embeds?.filter(it=>!it.id || !it.id.startsWith("eml_")) || []
                event.message.embeds.push(...msgEmbeds)
            }

            else if (event.type === "LOAD_MESSAGES_SUCCESS") {
                event.messages = event?.messages?.map(msg => {
                    const msgEmbeds = makeEmbeds(event?.message)
                    if (!msgEmbeds) return msg;
                    msg.embeds = msg.embeds?.filter(it=>!it.id || !it.id.startsWith("eml_")) || []
                    msg.embeds.push(...msgEmbeds)
                    return msg
                })
            }
        })
    }
}
