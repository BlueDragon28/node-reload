#!/usr/bin/env node

const options = require("./options");
const watcher = require("./watcher");
const program = require("./program");
const node = require("./nodeHandler")();

console.log("Starting node-reload!");

const listener = watcher(...options.argv.watch);

node.start();

const shouldAutorestart = options.argv.autorestart;

const app = program(() => {
    if (listener.isModified()) {
        console.log("Found modification, restarting!");
        node.restart();
    }

    if (shouldAutorestart && !node.isRunning()) {
        console.log("Automatic restarting!");
        node.restart();
    }
});
