import { Plugin } from "aliucord/entities";
import { getByProps, getModule, React, ReactNative as RN } from "aliucord/metro";
import { after } from "aliucord/utils/patcher";

export default class CreateWebhooks extends Plugin {
    public async start() {
        const ConnectedWebhooksOverview = getModule(m => m.default?.name === "ConnectedWebhooksOverview");
        const { create: createWebhook } = getByProps("update", "create", "fetchForChannel");
        
        after(ConnectedWebhooksOverview, "default", (ctx, component) => {
            if (!createWebhook) return;
            const {guild, channel} = component.props;

            if (channel && guild) {
                // very wacky way
                ctx.result = <RN.FlatList
                    data={[0, 1]}
                    renderItem={({item}) => {
                        console.log(item)
                        // @ts-ignore
                        if (item == '0') return component;
                        else return <RN.Button title="Create Webhook" onPress={() => {
                            createWebhook(guild.id, channel.id)
                        }}/>
                    }}
                />
            }
        })
    }
}
