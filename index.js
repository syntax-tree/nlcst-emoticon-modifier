'use strict';

/* Dependencies. */
var toString = require('nlcst-to-string');
var modifier = require('unist-util-modify-children');
var information = require('./data/emoticon.json');

/* Expose. */
module.exports = modifier(mergeEmoticons);

/* Node types. */
var EMOTICON_NODE = 'EmoticonNode';

/* Magic numbers.
 *
 * Emoticons are treated by a parser as multiple nodes.
 * Because this modifier walks forwards, when a non-
 * emoticon matches it would normaly walk to the end
 * (the last node). However, because the longest emoticon
 * is tokenized as `Punctuation` (eyes), `Punctuation`
 * (a tear), `Punctuation` (another tear), `Punctuation`
 * (a nose), and `Punctuation` (a frowning mouth), we can
 * safely break when the modifier has walked 5 characters. */
var MAX_EMOTICON_LENGTH = 5;

/* Unpack. */
var emoticons = information.emoticons;
var start = new RegExp(information.start.join('|'));
var end = information.end;

/* Merge emoticons into an `EmoticonNode`. */
function mergeEmoticons(child, index, parent) {
  var siblings;
  var value;
  var siblingIndex;
  var node;
  var emoticon;
  var subvalue;

  /* Check if `child`s first character could be used
   * to start an emoticon. */
  if (start.test(toString(child).charAt(0))) {
    siblings = parent.children;
    siblingIndex = index;
    node = child;
    value = '';

    while (node) {
      if (value.length >= MAX_EMOTICON_LENGTH) {
        return;
      }

      subvalue = toString(node);

      value += subvalue;

      /* The second test, if the last character of
       * the current node is superfluous but
       * improves performance by 30%. */
      if (
        node.type !== EMOTICON_NODE &&
        end.indexOf(subvalue.charAt(subvalue.length - 1)) !== -1 &&
        emoticons.indexOf(value) !== -1
      ) {
        emoticon = {type: EMOTICON_NODE, value: value};

        if (child.position && node.position) {
          emoticon.position = {
            start: child.position.start,
            end: node.position.end
          };
        }

        siblings.splice(index, siblingIndex - index + 1, emoticon);

        /* Some emoticons, like `:-`, can be followed by
         * more characters to form other emoticons. */
        return index - 1;
      }

      node = siblings[++siblingIndex];
    }
  }
}
