const options = require("./options");
const watcher = require("./watcher");
const program = require("./program");
const { option } = require("args");
const node = require("./nodeHandler")();

console.log("Starting node-reload!");

const listener = watcher(...options.argv.watch);

node.start();

const app = program(() => {
    if (listener.isModified()) {
        console.log("Found modification, restarting!");
        node.restart();
    }
});