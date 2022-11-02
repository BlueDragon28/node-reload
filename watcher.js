const fs = require("node:fs");
const p = require("node:path");

/*
A class object storing the filePath and the last time a modification was made.
*/
class File {
    /*
    Constructor of the File class.
    Get the path and the stat of the file.
    */ 
    constructor(path, stats) {
        this.path = path;
        this.lastModif = stats.mtimeMs;
    }
};

/*
Parse recursively a directory and return all the files included.
*/
function parseDir(path) {
    if (fs.existsSync(path)) {
        let files = []; // Stores all the files in the directory

        // Open the directory
        const dir = fs.opendirSync(path);

        // Parse the items inside the directory
        let item = dir.readSync();
        while (item) {
            if (item.isFile()) {
                // If its a file, add it to the files array.
                const filePath = p.join(dir.path, item.name);
                const fileStats = fs.lstatSync(filePath);
                if (fileStats) {
                    files.push(new File(filePath, fileStats));
                }
            } else if (item.isDirectory()) {
                // If its a directory, parse it and add the result files into files array.
                const dirPath = p.join(dir.path, item.name);
                const dirFiles = parseDir(dirPath);
                if (dirFiles && Array.isArray(dirFiles)) {
                    files = files.concat(dirFiles);
                }
            }

            // Read the next file/directory.
            item = dir.readSync();
        }

        dir.closeSync();

        return files;
    }
}

module.exports = {
    /*
    Retrieve recursively in an array all the files to be watched.
    */
    find: function(files) {
        if (typeof files === "string") {
            files = [ files ]; // Convert the string to an array.
        }

        if (Array.isArray(files)) {
            let findFiles = [];
            for (let file of files) {
                // First check if the file exists
                if (fs.existsSync(file)) {
                    // Getting the statistic of a file/directory
                    const stats = fs.lstatSync(file);

                    if(stats.isFile()) {
                        // If its a file, adding it into the findFiles array.
                        findFiles.push(new File(file, stats));
                    } else if (stats.isDirectory()) {
                        // If its a directory, parse it and add the files to the findFiles array.
                        const dirFiles = parseDir(file);
                        if (dirFiles && Array.isArray(dirFiles)) {
                            findFiles = findFiles.concat(dirFiles);
                        }
                    }
                }
            }

            return findFiles;
        }
    }
};