import { Plugin } from "aliucord/entities";
import { getByName, React, URLOpener } from "aliucord/metro";
import { after } from "aliucord/utils/patcher";
import { Pressable } from "react-native";

export default class ViewProfileImages extends Plugin {
    public async start() {
        const HeaderAvatar = getByName("HeaderAvatar");
        after(HeaderAvatar, "default", (ctx, component) => {
            const [{user, style}] = ctx.args;
            const image = user?.getAvatarURL?.(false, 4096, true);
            if (!image) return;

            component.props.style = {}
            user.avatarDecoration = null

            const discrim = user.discriminator % 5;
            const url = typeof image === 'number' ? `https://cdn.discordapp.com/embed/avatars/${discrim}.png` : image?.replace('.webp', '.png');

            ctx.result = <Pressable style={style} onPress={() => URLOpener.openURL(url)}>
                {component}
            </Pressable>
        })

        const ProfileBanner = getByName("ProfileBanner");
        after(ProfileBanner, "default", (ctx, component) => {
            const [{bannerSource}] = ctx.args;

            if (typeof bannerSource?.uri !== 'string' || !component) return;

            const url = bannerSource.uri
                .replace(/(?:\?size=\d{3,4})?$/, '?size=4096')
                .replace('.webp', '.png');

            ctx.result = <Pressable onPress={() => URLOpener.openURL(url)}>
                {component}
            </Pressable>
        })
    }
}
