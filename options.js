const args = require("args");
const strParser = require("./strParser");

// Parsing the command line options to args.
args.options([
    {
        /*
        The arguments to pass to the subcommand, usually the file to execute by node.
        */
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
        /*
        The command to execute, usually node.
        */
        name: "command",
        description: "The command to execute",
        defaultValue: "node"
    },
    {
        /*
        The elements (files or folders) to watch for change.
        Every time a change is detected, the command (ex: node) is restarted.
        */
        name: "watch",
        description: "Files or folders to watch for changes",
        defaultValue: [],
        init: w => {
            let watchElement = [];
            for (let e of w) {
                if (typeof e === "string") {
                    const splitStr = e.split(",");
                    watchElement = watchElement.concat(splitStr);
                }
            }

            return watchElement;
        }
    },
    {
        /*
        The delay between each iteration of watching, 250 is not too fast or too slow.
        */
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
    },
    {
        /*
        Should the program be autorestarted when it crash.
        */
        name: "autorestart",
        description: "Automatically restart the program when it crash",
        defaultValue: false
    }
]);

// Parsing the command line arguments.
const argv = args.parse(process.argv);

module.exports = {
    argv
};
