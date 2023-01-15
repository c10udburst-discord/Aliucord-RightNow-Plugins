import { Plugin } from "aliucord/entities";
import { exists, download, readFile } from "aliucord/native/fs";
import { ALIUCORD_DIRECTORY } from "aliucord/utils/constants";

export default class VendettaCompat extends Plugin {
    public async start() {
        const downloadUrl = "https://raw.githubusercontent.com/vendetta-mod/builds/master/vendetta.js";
        const filePath = ALIUCORD_DIRECTORY + "/vendetta.js"
        
        const run = () => eval(readFile(filePath));

        if (!exists(filePath))
            download(downloadUrl, filePath).then(run)
        else
            run();
    }
}
