import { Plugin } from "aliucord/entities";
import { getByProps, Constants } from 'aliucord/metro';
import { after, callOriginal } from "aliucord/utils/patcher";

export default class HiddenChannels extends Plugin {
    public async start() {
        const permissions = getByProps("getChannelPermissions");

        after(permissions, "can", ctx => {
            const [permId, channel] = ctx.args;

            if (permId === Constants.Permissions.VIEW_CHANNEL) {
                ctx.result = true
            }
        })

        
    }
}