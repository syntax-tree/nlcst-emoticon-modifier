'uses strict';

/* Dependencies. */
var fs = require('fs');
var unique = require('array-uniq');
var emoticons = require('emoticon');

var data = {};

data.emoticons = [].concat.apply([], emoticons.map(function (emoticon) {
  return emoticon.emoticons;
})).sort();

data.start = unique(data.emoticons.map(function (emoticon) {
  return emoticon.charAt(0);
}));

data.end = unique(data.emoticons.map(function (emoticon) {
  return emoticon.charAt(emoticon.length - 1);
}));

fs.writeFileSync('./data/emoticon.json', JSON.stringify(data, null, 2) + '\n');
