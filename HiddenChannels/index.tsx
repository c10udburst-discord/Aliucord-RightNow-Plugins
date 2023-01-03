import { Plugin } from "aliucord/entities";
import {
    SnowflakeUtils,
    getByProps,
    Constants,
    ChannelStore,
    React,
    getByName,
    Styles
} from 'aliucord/metro';
import { after, before, callOriginal } from "aliucord/utils/patcher";
import { Text, View } from "react-native";

export default class HiddenChannels extends Plugin {
    public async start() {
        const permissions = getByProps("getChannelPermissions", "can");

        function isHidden(channel: any | undefined) {
            if (channel == undefined) return false;
            if (typeof channel === 'string')
                channel = ChannelStore.getChannel(channel)
            // https://discord.com/developers/docs/resources/channel#channel-object-channel-types too lazy to find that in constants
            if (channel?.type === 1 || channel?.type === 3) return false;
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
        before(notifications, "hasRelevantUnread", ctx => {
            const [channel] = ctx.args
            if (isHidden(channel))
                ctx.result = false;
        })

        const navigator = getByProps("selectChannel")
        before(navigator, "selectChannel", ctx => {
            const [_, channelId] = ctx.args
            if (isHidden(channelId))
                ctx.result = null;
        })

        const Router = getByProps("transitionToGuild")
        before(Router, "transitionToGuild", ctx => {
            const [_, channel] = ctx.args
            if (isHidden(channel))
                ctx.result = null;
        })

        const MessagesConnected = getByName("MessagesConnected")
        const MessageStyles = Styles.createThemedStyleSheet({
            'container': {
                'flex': 1,
                'alignItems': 'center',
                'justifyContent': 'center',
                'backgroundColor': Constants.ThemeColorMap.BACKGROUND_PRIMARY,
            },
            'title': {
                'fontFamily': Constants.Fonts.PRIMARY_SEMIBOLD,
                'fontSize': 24,
                'backgroundColor':Constants.ThemeColorMap.BACKGROUND_PRIMARY,
                'textAlign': 'left',
                'color': Constants.ThemeColorMap.HEADER_PRIMARY,
                'paddingVertical': 25
            },
            'text': {
                'fontSize': 16,
                'backgroundColor':Constants.ThemeColorMap.BACKGROUND_PRIMARY,
                'textAlign': 'justify',
                'color': Constants.ThemeColorMap.HEADER_PRIMARY,
            }
        })
        after(MessagesConnected, "default", (ctx, res) => {
            const channel = res.props.channel;
            if (!isHidden(channel)) return;

            ctx.result = <View style={MessageStyles.container}>
                <Text style={MessageStyles.title}>This channel is hidden.</Text>
                <Text style={MessageStyles.text}>
                    Topic: {channel.topic || "No topic."}
                    {"\n\n"}
                    Last message: {channel.lastMessageId ? new Date(SnowflakeUtils.extractTimestamp(channel.lastMessageId)).toLocaleString() : "No messages."}
                    {"\n\n"}
                    Last pin: {channel.lastPinTimestamp ? (new Date(channel.lastPinTimestamp)).toLocaleString() : "No pins."}
                </Text>
            </View>
        })
    }
}