/*
This module handle the node starting and destruction.
*/

const options = require("./options");
const c = require("node:child_process");

class NodeHandler {
    constructor() {
        this.processPath = options.argv.command;
        this.args = options.argv.arguments;
        this.process = null;
    }

    /*
    Starting the node program.
    */
    start() {
        // Stopping the process if its already running.
        if (this.isRunning()) {
            this.stop();
        }

        // If the process fail to start, it mean the command does not exists
        // or the arguments are not valid.
        this.process = c.spawn(this.processPath, this.args);

        // If the process fail to start, stop the program.
        this.process.on("error", err => {
            console.log(`Failed to start ${this.processPath}.`);
            process.exit(-1);
        });

        const output = data => {
            console.log(`${data}`);
        }

        this.process.stdout.on("data", output);
        this.process.stderr.on("data", output);

        this.process.on("close", () => {
            console.log(`${this.processPath} has been closed!`);
        });
    }

    /*
    Stopping the node program.
    */
    stop() {
        if (this.isRunning()) {
            this.process.kill();
            this.process = null;
        }
    }

    /*
    Helper function to restart node.
    */
    restart() {
        this.stop();
        this.start();
    }

    /*
    Indicate if the process is running.
    */
    isRunning() {
        return this.process && this.process.exitCode === null;
    }
}

module.exports = function() {
    return new NodeHandler();
}