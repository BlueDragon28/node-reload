const watcher = require("./watcher");
const program = require("./program");
const node = require("./nodeHandler")();

const listener = watcher("../testDir", "./index.js");

node.start();

const app = program(() => {
    if (listener.isModified()) {
        console.log("has modification!");
        node.restart();
    }
});