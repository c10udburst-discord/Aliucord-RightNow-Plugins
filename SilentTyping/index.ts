import { Plugin } from "aliucord/entities";
import { getByProps } from 'aliucord/metro';
import { before } from "aliucord/utils/patcher";

export default class SilentTyping extends Plugin {
    public async start() {
        const typing = getByProps("startTyping");

        before(typing, "startTyping", ctx => {
            ctx.result = null
        })
    }
}