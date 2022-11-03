const watcher = require("./watcher");
const program = require("./program");
const node = require("./nodeHandler")();

const files = watcher.find("../testDir");

node.start();

const app = program(() => {
    if (watcher.isModified(files)) {
        console.log("has modification!");
        node.restart();
    }
});