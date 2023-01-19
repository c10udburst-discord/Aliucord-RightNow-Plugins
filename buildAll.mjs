import { spawnSync } from "child_process";
import { platform } from "process";
import { existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { readdir } from "fs"

readdir(cwd(), { withFileTypes: true }, (err, folders) => {
    folders.forEach(folder => {
        if(!folder.isDirectory()) return;
        const folderName = folder.name;
        const manifestPath = join(folderName, "manifest.json")
        if(existsSync(manifestPath))
        {
            let path = null
            if (existsSync(join(folderName, "index.ts"))) path = join(folderName, "index.ts")
            else if (existsSync(join(folderName, "index.tsx"))) path = join(folderName, "index.tsx")
            if(!existsSync(path))
            {
                console.log(`Skipping ${folderName}`)
                return;
            }
            const proc = spawnSync((platform === "win32") ? ".\\node_modules\\.bin\\rollup.cmd" : "node_modules/.bin/rollup", ["-c", "--configPlugin", "typescript"].filter(Boolean), {
                stdio: "inherit",
                cwd: cwd(),
                env: {
                    plugin: folderName,
                    pluginPath: path
                }
            });
            
            if (proc.error) {
                console.error(proc.error)
            }
        }

    })
})
