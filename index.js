const options = require("./options");
const watcher = require("./watcher");
const program = require("./program");
const { option } = require("args");
const node = require("./nodeHandler")();

const listener = watcher(...options.argv.watch);

node.start();

const app = program(() => {
    if (listener.isModified()) {
        console.log("has modification!");
        node.restart();
    }
});