import { Plugin } from "aliucord/entities";
import { getByName, React, Styles, GuildMemberStore } from "aliucord/metro";
import { after } from "aliucord/utils/patcher";

import { Text } from "react-native";

export default class UserDetails extends Plugin {
    public async start() {
        const convertSnowflakeToDate = (snowflake) => new Date(parseInt(snowflake)/4194304 + 1420070400000)

        const UserProfileBio = getByName("UserProfileBio")

        const MessageStyles = Styles.createThemedStyleSheet({
            'title': {
                "fontFamily": "ABCGintoNormalVariable_Bold",
                "fontSize": 12,
                "lineHeight": 16,
                "color": "#b9bbbe",
                "textTransform": "uppercase",
                "letterSpacing": 0.2,
                'marginLeft': 15,
                "marginTop": 6,
                "marginBottom": 6
            },
            'text': {
                'fontFamily': "Whitney-Medium",
                'fontSize': 16,
                'textAlign': 'left',
                'color': "#ffffff",
                'marginLeft': 20,
                'flex': 1
            }
        })
        
        after(UserProfileBio, "default", (ctx, component) => {
            const {user, guild} = component.props;

            if (!user) return;

            const member = guild && GuildMemberStore.getMember(guild.id, user.id)

            ctx.result = [
                component,
                <>
                    <Text style={MessageStyles.title}>User details</Text>
                    <Text style={MessageStyles.text}>{`Created: ${convertSnowflakeToDate(user.id).toLocaleString()}`}</Text>
                    {member && 
                        <Text style={MessageStyles.text}>{`Joined: ${(new Date(member.joinedAt)).toLocaleString()}`}</Text>
                    }
                </>
            ]
        })
    }
}