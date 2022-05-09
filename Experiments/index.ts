import { Plugin } from 'aliucord/entities';
import { getByProps } from 'aliucord/metro';

export default class Experiments extends Plugin {
  public async start() {
    const User = getByProps('isDeveloper');

    Object.defineProperty(User, 'isDeveloper', {
      get: () => true,
      set: () => {},
      configurable: true,
    });
  }
}
