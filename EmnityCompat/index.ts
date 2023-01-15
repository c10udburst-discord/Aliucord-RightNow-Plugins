import { Plugin } from "aliucord/entities";
import { exists, download, readFile } from "aliucord/native/fs";
import { ALIUCORD_DIRECTORY } from "aliucord/utils/constants";

export default class EmnityCompat extends Plugin {
    public async start() {
        const downloadUrl = "https://raw.githubusercontent.com/enmity-mod/enmity/main/dist/Enmity.js";
        const filePath = ALIUCORD_DIRECTORY + "/Enmity.js"
        
        const run = () => eval(readFile(filePath));

        if (!exists(filePath))
            download(downloadUrl, filePath).then(run)
        else
            run();
    }
}
