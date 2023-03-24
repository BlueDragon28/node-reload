# Node-reload

A simple node.js program to automatically restart a program on development when a file change.

## Install

Node-reload is not yet an npm package, so you have to install it yourself. Just clone the repo and run `npm install` in it.

## Command

```
 node index.js -h
  Usage: index.js [options] [command]
  
  Commands:
    help     Display help
    version  Display version
  
  Options:
    -a, --arguments <list>  The arguments to pass to the subcommand (defaults to ["./index.js"])
    -A, --autorestart       Automatically restart the program when it crash (disabled by default)
    -c, --command [value]   The command to execute (defaults to "node")
    -d, --delay <n>         The delay between each interval is ms, cannot be under 15 ms (defaults to 250)
    -h, --help              Output usage information
    -v, --version           Output the version number
    -w, --watch <list>      Files or folders to watch for changes (defaults to [])
```

## License

The software is licensed under the **MIT** license. Check the [LICENSE](LICENSE) file.
