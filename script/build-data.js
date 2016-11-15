'uses strict';

/* Dependencies. */
var fs = require('fs');
var unique = require('array-uniq');
var emoticons = require('emoticon').emoticon;

var data = {};

data.emoticons = Object.keys(emoticons);

data.start = unique(data.emoticons.map(function (emoticon) {
  return emoticon.charAt(0);
}));

data.end = unique(data.emoticons.map(function (emoticon) {
  return emoticon.charAt(emoticon.length - 1);
}));

fs.writeFileSync('./data/emoticon.json', JSON.stringify(data, null, 2) + '\n');
