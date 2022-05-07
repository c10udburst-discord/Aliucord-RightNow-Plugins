import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { argv, cwd, exit } from "process";

function check(bool, message) {
    if (!bool) {
        console.error(message);
        exit(1);
    }
}

let watch;
let plugin = argv[2];
if (plugin === "--watch") {
    watch = true;
    plugin = argv[3];
}

check(!!plugin, `Usage: ${argv.join(" ")} <PLUGIN>`);

const path = join(plugin, "index.ts");
check(existsSync(path), `No such file: ${path}`);

spawnSync("node_modules/.bin/rollup", ["-c", "--configPlugin", "typescript", watch && "--watch"].filter(Boolean), {
    stdio: "inherit",
    cwd: cwd(),
    env: {
        plugin
    }
});
