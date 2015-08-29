/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module nlcst:emoticon-modifier
 * @fileoverview Build data.
 */

'uses strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var emoticons = require('emoticon').emoticon;
var unique = require('array-uniq');
var fs = require('fs');

/*
 * Data.
 */

var data = {};

data.emoticons = Object.keys(emoticons);

data.start = unique(data.emoticons.map(function (emoticon) {
    return emoticon.charAt(0);
}));

data.end = unique(data.emoticons.map(function (emoticon) {
    return emoticon.charAt(emoticon.length - 1);
}));

/*
 * Write.
 */

fs.writeFileSync('./data/emoticon.json', JSON.stringify(data, null, 2) + '\n');
