import { Plugin } from "aliucord/entities";
import { getByName, getModule, React, URLOpener } from "aliucord/metro";
import { after } from "aliucord/utils/patcher";
import { Pressable } from "react-native";

export default class ViewProfileImages extends Plugin {
    public async start() {
        const HeaderAvatar = getByName("HeaderAvatar");
        
        after(HeaderAvatar, "default", (ctx, component) => {
            const uri = component?.props?.source?.uri;

            const image = uri && uri.replace(/size=\d+/g, "size=4096").replace(".webp", ".png")
            if (image) {
                ctx.result = <Pressable onPress={() => URLOpener.openURL(image)}>
                    {component}
                </Pressable>
            }
        })
    }
}
