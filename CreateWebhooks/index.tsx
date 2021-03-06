import { Plugin } from "aliucord/entities";
import { getByName, getByProps, i18n, React, ReactNative as RN } from "aliucord/metro";
import { getAssetId } from "aliucord/utils";
import { after } from "aliucord/utils/patcher";

export default class CreateWebhooks extends Plugin {
    public async start() {
        const ConnectedWebhooksOverview = getByName("ConnectedWebhooksOverview");
        const Button = getByName("Button").default;
        const { create: createWebhook } = getByProps("update", "create", "fetchForChannel");
        
        after(ConnectedWebhooksOverview, "default", (ctx, component) => {
            if (!createWebhook) return;
            const {guild, channel} = component.props;

            if (channel && guild) {
                // very wacky way
                ctx.result = <RN.FlatList
                    data={[0, 1]}
                    renderItem={({item}) => {
                        // @ts-ignore
                        if (item == '0') return component;
                        else return <Button text={i18n.Messages.WEBHOOK_CREATE} onPress={() => {
                            createWebhook(guild.id, channel.id)
                        }}/>
                    }}
                />
            }
        })
    }
}