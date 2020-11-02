'use strict'

var toString = require('nlcst-to-string')
var modifier = require('unist-util-modify-children')
var raw = require('emoticon')

module.exports = modifier(mergeEmoticons)

// Magic numbers.
//
// Emoticons are treated by a parser as multiple nodes.
// Because this modifier walks forwards, when a non-emoticon matches it would
// normaly walk to the end (the last node).
// However, because the longest emoticon is tokenized as `Punctuation` (eyes),
// `Punctuation` (a tear), `Punctuation` (another tear), `Punctuation` (a nose),
// and `Punctuation` (a frowning mouth), we can safely break when the modifier
// has walked 5 characters.
var maxEmoticonLength = 5

// Unpack.
var emoticons = []
var start = []
var end = []

unpack()

// Merge emoticons into an `EmoticonNode`.
function mergeEmoticons(child, index, parent) {
  var value
  var siblingIndex
  var node
  var emoticon

  // Check if `child`s first character could be used to start an emoticon.
  if (start.indexOf(toString(child).charAt(0)) !== -1) {
    value = ''
    siblingIndex = index
    node = child

    while (node) {
      if (value.length >= maxEmoticonLength) {
        return
      }

      value += toString(node)

      // The second test, if the last character of the current node is
      // superfluous but improves performance by 30%.
      if (
        node.type !== 'EmoticonNode' &&
        end.indexOf(value.charAt(value.length - 1)) !== -1 &&
        emoticons.indexOf(value) !== -1
      ) {
        emoticon = {type: 'EmoticonNode', value: value}

        if (child.position && node.position) {
          emoticon.position = {
            start: child.position.start,
            end: node.position.end
          }
        }

        parent.children.splice(index, siblingIndex - index + 1, emoticon)

        // Some emoticons, like `:-`, can be followed by more characters to form
        // other emoticons.
        return index - 1
      }

      node = parent.children[++siblingIndex]
    }
  }
}

function unpack() {
  var index = -1
  var subset
  var offset
  var char

  while (++index < raw.length) {
    subset = raw[index].emoticons
    offset = -1

    while (++offset < subset.length) {
      emoticons.push(subset[offset])

      char = subset[offset].charAt(0)
      if (start.indexOf(char) === -1) start.push(char)

      char = subset[offset].charAt(subset[offset].length - 1)
      if (end.indexOf(char) === -1) end.push(char)
    }
  }
}
