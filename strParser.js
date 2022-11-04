/*
Parsing string for passing command line arguments to a process like node.
*/

/*
Getting the position of the next quote.
*/
function getNextQuote(str, t) {
    const type = {};

    if (typeof str === "string") {
        const iQuote = str.indexOf("'");
        const iDQuote = str.indexOf("\"");

        if (typeof t === "string") {
            // If the type is indicated, return the position of the specific type.
            if (t === "quote") {
                if (iQuote !== -1) {
                    return iQuote;
                } else {
                    return null;
                }
            } else if (t === "dQuote") {
                if (iDQuote !== -1) {
                    return iDQuote;
                } else {
                    return null;
                }
            }
        } else {
            // Return the position of the closest quote.
            if ((iQuote !== -1 && iDQuote === -1) || (iQuote !== -1 && iQuote < iDQuote)) {
                type.type = "quote";
                type.pos = iQuote;
            } else if ((iDQuote !== -1 && iQuote === -1) || (iDQuote !== -1 && iDQuote < iQuote)) {
                type.type = "dQuote";
                type.pos = iDQuote;
            }
        }
    }

    return type;
}

/*
Finding the position of the next space or the quote.
*/
function getSpaceOrQuotePos(str) {
    const type = {};

    if (typeof str === "string") {
        const iSpace = str.indexOf(" ");
        const quoteType = getNextQuote(str);

        if (iSpace === -1) {
            // There is nothing to separe.
            type.type = null;
        } else if (iSpace !== -1 && 
                    (!quoteType.type || iSpace < quoteType.pos)) {
            // Split the string by the first space.
            type.type = "space";
            type.pos = iSpace;
        } else if (quoteType.type === "quote" || quoteType.type === "dQuote") {
            type.type = quoteType.type;
            type.pos = quoteType.pos;
        }
    }

    return type;
}

/*
Split the string between space.
*/
function splitSpace(str, pos) {
    if (typeof str === "string" && str.length > 0 && pos > 0) {
        // Retrieve the string to the space.
        return {
            newStr: str.slice(0, pos),
            oldStr: str.slice(pos+1).trim()
        };
    }
}

/*
Retrieve the test between quote.
*/
function retrieveToNextQuote(str, pos) {
    if (typeof str === "string" && str.length > 0 && pos >= 0) {
        return {
            newStr: str.slice(0, pos+1),
            oldStr: str.slice(pos+1)
        };
    }
}

/*
Retrieve the text before and between quotes.
*/
function getBetweenQuote(str, type) {
    if (typeof str === "string" && type) {
        const returnValue = {
            doNotSplit: false
        };

        // Retrieve text before the first quote.
        let nextQuote = retrieveToNextQuote(str, type.pos);
        let newStr = nextQuote.newStr;
        str = nextQuote.oldStr;

        // Retrieve text between quotes.
        const nextQuotePos = getNextQuote(str, type.type);
        if (nextQuotePos) {
            nextQuote = retrieveToNextQuote(str, nextQuotePos);
            newStr += nextQuote.newStr;
            str = nextQuote.oldStr;
        } else {
            newStr += str;
            str = "";
        }

        // Check if there is text after the last quote.
        // If so, indicate to not split it.
        if (str.length > 0 && str[0] !== " ") {
            returnValue.doNotSplit = true;
        } else {
            returnValue.doNotSplit = false;
        }

        returnValue.newStr = newStr;
        returnValue.oldStr = str;

        return returnValue;
    }
}

/*
Split the text base on space or quotes.
*/
function splitToSpaceOrQuote(str) {
    if (typeof str === "string") {
        // Retrieve if there is something to split.
        const type = getSpaceOrQuotePos(str);
        
        if (type.type === "space") {
            // Retrieve the string to the space.
            return splitSpace(str, type.pos);
        } else if (type.type === "dQuote" || type.type === "quote") {
            return getBetweenQuote(str, type);
        }
    }

    return {
        newStr: str,
        oldStr: ""
    };
}

/*
Split the text base on space or quotes until the whole string is processed.
*/
function splitStr(str) {
    if (typeof str === "string" && str.length > 0) {
        str = str.trim();
        const args = [];
        let tmpStr = "";

        while (str.length > 0) {
            const obj = splitToSpaceOrQuote(str);
            tmpStr += obj.newStr;
            str = obj.oldStr;

            if (!obj.doNotSplit) {
                args.push(tmpStr);
                tmpStr = "";
                str = str.trim();
            }
        }

        return args;
    }
}

module.exports = {
    parseArgv: splitStr
};