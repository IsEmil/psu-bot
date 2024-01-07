const cp = require("child_process");
const path = require("path");
const tmp = require("tmp");
const fs = require("fs");

/**
 * @param {String} src
 * @param {String} option
 */
module.exports = (src, option) => {
    return new Promise((resolve, reject) => {
        // Input = Inputted file by user
        const input = tmp.fileSync();
        // Output = Obfuscated file returned by PSU

        fs.writeFileSync(input.name, src);

        // Spawns a process for PSU Client dll and parces the file name and output name
        const process = cp.spawn("dotnet", [path.join(__dirname, `/psu/Source/${option === "premium" ? "premium" : "free"}/obf-cli.dll`, input.name, "lol")], {
            cwd: path.join(__dirname, `/psu/Source/${option === "premium" ? "premium" : "free"}`), // Joins the Current Working dir of the js file with the source folder
            detached: true, // detaches
        });

        process.stderr.on("data", (data) => {
            const err = Buffer.from(data).toString("ascii");
            console.log(err);
        });

        process.on("error", (err) => reject(err));

        process.on("exit", (code) => {
            let source = fs.readFileSync(path.join(__dirname, `/psu/Source/${option === "premium" ? "premium" : "free"}/lol/Output.lua`), "utf-8");

            input.removeCallback();

            return resolve(source);
        });
    });
}
