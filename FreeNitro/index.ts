import { Plugin } from 'aliucord/entities';
import { getByProps } from 'aliucord/metro';
import { Patcher } from 'aliucord/utils';

const [{ getEmojiURL }, usability, { getChannel }, Messages] = [
  getByProps('getEmojiURL'),
  getByProps('canUseEmojisEverywhere', 'canUseAnimatedEmojis'),
  getByProps('getChannel'),
  getByProps('receiveMessage', 'sendMessage'),
];

type Emoji = {
  roles: any[];
  require_colons: boolean;
  name: string;
  managed: boolean;
  id: string;
  available: boolean;
  animated: boolean;
  url: string;
  allNamesString: string;
  guildId: string;
  size: number;
};

export default class FreeNitro extends Plugin {
  public start() {
    Patcher.after(usability, 'canUseEmojisEverywhere', () => true);
    Patcher.after(usability, 'canUseAnimatedEmojis', () => true);
    Patcher.before(Messages, 'sendMessage', (_, [channelId, message]) => {
      const channel = getChannel(channelId);
      message.validNonShortcutEmojis.forEach((e: Emoji, i: number) => {
        if (e.guildId !== channel.guildId) {
          e.size = 24;
          message.content = message.content.replace(
            `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
            getEmojiURL(e).replace('webp', 'png'),
          );
          delete message.validNonShortcutEmojis[i];
        }
      });
      message.validNonShortcutEmojis = message.validNonShortcutEmojis.filter((e: Emoji) => e);
    });
  }
}
