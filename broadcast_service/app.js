/*jslint browser: false, nomen: true, sloppy: true*/
/*global require, console*/

//TODO: Eduardo, I still don't know the best way to organize all objects (inside a IIFE, inside a module, a literal, etc.)
//It's still all at the global level, I know it can be improved.

var fs = require('fs'),
    twitterAPI = require('node-twitter-api'),
    files = fs.readdirSync('../content/'),
    fileIterator,
    currentFile,
    entries = [];

//TODO: How can we set these values on a config file that's not tracked by git?
var twitter = new twitterAPI({
    consumerKey: '',
    consumerSecret: ''
});


function getFirstLineFromMd(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            throw err;
            //TODO: Is there another way to do this?
        }

        // Data is a buffer that we need to convert to a string
        // Improvement: loop over the buffer and stop when the line is reached
        var lines = data.toString('utf-8').split("\n");

        if (lines.length === 0) {
            return callback('File is empty', null);
        }
        callback(null, lines[0]);
    });
}

function addEntryToIndex(fileName) {
    getFirstLineFromMd('../content/' + fileName, function (err, text) {
        console.log("adding to index: " + text);
        entries.push({
            file: fileName,
            content: text
        });
    });
}

function postToTimeline(message, url){
    twitter.statuses("update", {
        status: message
    },
    '1888546812-WNwEwWmHyhmCEqIohyxsEUnkIHCkrHMao4VIrsp',
    '3pET7j3MSY6G4AwaV43KZYCIi45F3iNJwqBHGXaR8', function (error, data, response) {
        if (error) {
            console.log('Error: ' + error);
        } else {
            console.log(response);
        }
    });
}

for (fileIterator in files) {
    currentFile = files[fileIterator];
    if (currentFile.split('.').pop().toLowerCase() === 'md') {
        addEntryToIndex(currentFile);
    }
}