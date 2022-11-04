const args = require("args");
const strParser = require("./strParser");

// Parsing the command line options to args.
args.options([
    {
        name: "arguments",
        description: "The arguments to pass to the subcommand",
        defaultValue: [ "./index.js" ],
        init: aArgs => {
            let parsedArgs = [];
            for (let arg of aArgs) {
                if (typeof arg === "string") {
                    const splitStr = strParser.parseArgv(arg);
                    parsedArgs = parsedArgs.concat(splitStr);
                }
            }
            return parsedArgs;
        }
    },
    {
        name: "command",
        description: "The command to execute",
        defaultValue: "node"
    },
    {
        name: "delay",
        description: "The delay between each interval is ms, cannot be under 15 ms",
        defaultValue: 250,
        init: delay => {
            if (typeof delay !== "number" || delay < 15) {
                console.log("-d, --delay: cannot be under 15");
                process.exit(-1);
            } else {
                return delay;
            }
        }
    }
]);

// Parsing the command line arguments.
const argv = args.parse(process.argv);

module.exports = {
    argv
};