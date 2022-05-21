import { Plugin } from "aliucord/entities";
import {
    getByProps,
    Constants,
    ChannelStore,
    ReactNative as RN,
    FluxDispatcher,
    Dialog
} from 'aliucord/metro';
import { before, callOriginal } from "aliucord/utils/patcher";

export default class HiddenChannels extends Plugin {
    public async start() {
        const permissions = getByProps("getChannelPermissions", "can");

        function isHidden(channel: any | undefined) {
            if (channel == undefined) return false;
            if (typeof channel === 'string')
                channel = ChannelStore.getChannel(channel)
            if (channel?.type === 1) return false;
            return !callOriginal(permissions.can, permissions, Constants.Permissions.VIEW_CHANNEL, channel)
        }

        before(permissions, "can", ctx => {
            const [permId, channel] = ctx.args;

            if (permId === Constants.Permissions.VIEW_CHANNEL) {
                ctx.result = true
            }
        })

        const notifications = getByProps("hasUnread", "hasUnreadPins", "getMentionCount")
        before(notifications, "hasUnread", ctx => {
            const [channel] = ctx.args
            if (isHidden(channel))
                ctx.result = false;
        })
        before(notifications, "hasUnreadPins", ctx => {
            const [channel] = ctx.args
            if (isHidden(channel))
                ctx.result = false;
        })
        before(notifications, "getMentionCount", ctx => {
            const [channel] = ctx.args
            if (isHidden(channel))
                ctx.result = 0;
        })

        const messageFetch = getByProps("fetchMessages")
        before(messageFetch, "fetchMessages", ctx => {
            const [_, channel] = ctx.args
            if (isHidden(channel))
                ctx.result = null;
        })

        const navigator = getByProps("selectChannel")
        before(navigator, "selectChannel", ctx => {
            const [_, channelId] = ctx.args
            if (isHidden(channelId)) {
                FluxDispatcher.dispatch({
                    type: Constants.ActionTypes.LOAD_MESSAGES_FAILURE,
                    channelId
                })
                const channel = ChannelStore.getChannel(channelId)
                Dialog.show({
                    title: channel.name,
                    body: channel.topic,
                    isDismissable: true
                })
                ctx.result = null;
            }
        })

        const Router = getByProps("transitionToGuild")
        before(Router, "transitionToGuild", ctx => {
            const [_, channel] = ctx.args
            if (isHidden(channel))
                ctx.result = null;
        })
    }
}