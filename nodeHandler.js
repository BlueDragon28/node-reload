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
        this.askRestart = false; // Set to true when restarting the process.
        this.restartInterval = null; // The restart interval loop, wait until the process stop running.
    }

    /*
    Starting the node program.
    */
    start() {
        // Stopping the process if its already running.
        if (this.askRestart && this.restartInterval) {
            return;
        } else if (this.isRunning()) {
            this.stop();
        }

        console.log(`Starting ${this.processPath}!`);

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
            console.log(`The process ${this.processPath} has been closed!`);
        });
    }

    /*
    Stopping the node program.
    */
    stop() {
        if (this.isRunning() && !this.askRestart && !this.restartInterval) {
            this.process.kill();
            this.process = null;
        }
    }

    /*
    Helper function to restart node.
    */
    restart() {
        // this.stop();
        // this.start();
        if (this.isRunning()) {
            // Send a signal to close the process.
            this.process.kill();
            this.askRestart = true;

            this.restartInterval = setInterval(() => {
                if (!this.isRunning()) {
                    // When the process stop running, stop waiting and restart a new instance.
                    clearInterval(this.restartInterval);
                    this.restartInterval = null;
                    this.process = null;
                    this.askRestart = false;

                    this.start();
                }
            }, 150);
        }
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