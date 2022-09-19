import { Plugin } from 'aliucord/entities';
import { getByProps, UserStore } from 'aliucord/metro';
import { before } from "aliucord/utils/patcher";

export default class Experiments extends Plugin {
  public async start() {
    
    before(UserStore, 'getCurrentUser', ctx => {
      const User = getByProps('isDeveloper');
      const STAFF = al.metro.getByProps("UserFlags").STAFF;
      const Nodes = Object.values(User._dispatcher._actionHandlers._dependencyGraph.nodes);

      AliuHermes.unfreeze(User)

      Object.defineProperty(User, 'isDeveloper', {
        get: () => true,
        configurable: false,
      });

      UserStore.getCurrentUser().flags |= STAFF;

      Nodes.find(n => n.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({
          user: { flags: STAFF }, type: "CONNECTION_OPEN"
      });
      Nodes.find(n => n.name == "DeveloperExperimentStore").actionHandler["OVERLAY_INITIALIZE"]();
    });
  }
}
