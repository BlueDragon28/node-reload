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

    /*
    Update the lastModif member variable and check if the file
    has been modified since the last check.
    */
    isModified() {
        if (!fs.existsSync(this.path)) {
            return true;
        }

        const stats = fs.lstatSync(this.path);
        if (stats) {
            const newLastModif = stats.mtimeMs;

            if (newLastModif > this.lastModif) {
                this.lastModif = newLastModif;
                return true;
            }
        }

        return false;
    }
};

/*
A class to handle files watching and new files creation on listening directory
*/
class FilesListener {
    /*
    The constructor watch all the files listed and the files insides the directory listed.
    Every time a files is created on a listened directory.
    */
    constructor(...paths) {
        if (!paths) {
            return;
        }

        this.pathsToWatch = paths;
        this.files = this.findFiles();
    }

    /*
    Check if a file inside the files arrays has beed modified since last time.
    */
    isModified() {
        if (!this.files && !Array.isArray(this.file)) {
            return false;
        }

        let hasModification = false;

        // Check if there is modification in the files.
        for (let file of this.files) {
            if (file) {
                if (file.isModified()) {
                    hasModification = true; // Do not stop here, we want to update the stats of all the files.
                }
            }
        }

        // Now check if there is new or less files.
        if (this.isNewOrLessFiles()) {
            hasModification = true;
        }

        return hasModification;
    }

    /*
    Check if there is new files created or deleted.
    */
    isNewOrLessFiles() {
        const files = this.findFiles();

        if (files.length !== this.files.length) {
            this.files = files;
            return true;
        }

        return false;
     }

    /*
    Retrieve all the files inside a directory and subdirectories.
    */
    parseDir(path) {
        if (typeof path === "string" && fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
            let files = [];

            // Open the directory
            const dir = fs.opendirSync(path);

            if (dir) {
                // Read all the files inside dir.
                let item = dir.readSync();

                while (item) {
                    if (item.isFile()) {
                        // If the item is a file, adding it to the files arrays.
                        const filePath = p.join(dir.path, item.name);
                        const fileStats = fs.lstatSync(filePath);
                        if (fileStats) {
                            files.push(new File(filePath, fileStats));
                        }
                    } else if (item.isDirectory()) {
                        // If the item is a directory, call the parseDir recursively.
                        const dirPath = p.join(dir.path, item.name);
                        const dirFiles = this.parseDir(dirPath);
                        if (dirFiles && Array.isArray(dirFiles)) {
                            files = files.concat(dirFiles);
                        }
                    }

                    item = dir.readSync();
                }

                dir.closeSync();

                return files;
            }
        }
    }

    /*
    Find all the files to watch.
    */
    findFiles() {
        if (!this.pathsToWatch) {
            return;
        }

        let files = [];

        for (let path of this.pathsToWatch) {
            if (typeof path === "string") {
                // Check if the file/dir exists.
                if (fs.existsSync(path)) {
                    // Retrieve information about the file/dir.
                    const stats = fs.lstatSync(path);

                    if (stats) {
                        if (stats.isFile()) {
                            // If its a file, add it to the files arrays.
                            files.push(new File(path, stats));
                        } else if (stats.isDirectory()) {
                            // If its a directory, parse all the files inside the directory and subdirectory.
                            const dirFiles = this.parseDir(path);

                            if (dirFiles) {
                                // Append the files into the files arrays.
                                files = files.concat(dirFiles);
                            }
                        }
                    }
                }
            }
        }

        return files;
    }
};

module.exports = function(...paths) {
    if (!paths) {
        return;
    }

    return new FilesListener(...paths);
}