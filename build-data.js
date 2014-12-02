'uses strict';

/**
 * Dependencies.
 */

var emoticon,
    fs;

emoticon = require('emoticon');
fs = require('fs');

/**
 * Utilities.
 */

function unique(value, index, context) {
    return context.indexOf(value, index + 1) === -1;
}

/**
 * Data.
 */

var data;

data = {};

data.emoticons = Object.keys(emoticon.emoticon);

data.start = data.emoticons.map(function (emoticon) {
    return emoticon.charAt(0);
}).filter(unique);

data.end = data.emoticons.map(function (emoticon) {
    return emoticon.charAt(emoticon.length - 1);
}).filter(unique);

/**
 * Write.
 */

fs.writeFileSync('./data/emoticon.json',
    JSON.stringify(data, null, 2) + '\n'
);
