import { Plugin } from 'aliucord/entities';
import { getByProps } from 'aliucord/metro';

export default class Experiments extends Plugin {
  public async start() {
    const User = getByProps('isDeveloper');

    AliuHermes.unfreeze(User)

    Object.defineProperty(User, 'isDeveloper', {
      get: () => true,
      set: () => {},
      configurable: true,
    });
  }
}