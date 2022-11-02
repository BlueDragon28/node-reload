/*
The program module handle the execution the execution of the program.
Whenever a signal like SIGINT or SINGTERM is called, the program will close.
*/

/*
Store the state of the program and close the program when needed.
*/
class Program {
    constructor(callback) {
        if (typeof callback === "function") {
            /*
            Initialize the basic program member variable.
            This include if the program is running and the user callback.
            */
            this.isRunning = true;
            this.userCallback = callback;
            this.isError = false;

            // Calling the user callback in an infinite loop until the program close.
            this.intervalID = setInterval(() => {
                this.userCallback();

                if (!this.isRunning) {
                    clearInterval(this.intervalID);
                }
            }, 250);

            // Listening to the system asking to close the program.
            process.on("SIGINT", () => { this.close(); });
            process.on("SIGTERM", () => { this.close(); });
        } else {
            this.isError = true;
        }
    }

    // Set the isRunning member variable to false.
    close() {
        this.isRunning = false;
    }
}

// Export the module has a simple function.
module.exports = function(callback) {
    return new Program(callback);
}