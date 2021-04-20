/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

import {toString} from 'nlcst-to-string'
import {modifyChildren} from 'unist-util-modify-children'
import {emoticon} from 'emoticon'

export const emoticonModifier = modifyChildren(mergeEmoticons)

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

/** @type {Array.<string>} */
var emoticons = []
/** @type {Array.<string>} */
var start = []
/** @type {Array.<string>} */
var end = []

unpack()

/**
 * Merge emoticons into an `EmoticonNode`.
 *
 * @param {Node} child
 * @param {number} index
 * @param {Parent} parent
 *
 */
function mergeEmoticons(child, index, parent) {
  /** @type {string} */
  var value
  /** @type {number} */
  var siblingIndex
  /** @type {Node} */
  var node
  /** @type {Node} */
  var emoticonNode

  // Check if `child`s first character could be used to start an emoticon.
  if (start.includes(toString(child).charAt(0))) {
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
        end.includes(value.charAt(value.length - 1)) &&
        emoticons.includes(value)
      ) {
        emoticonNode = {type: 'EmoticonNode', value}

        if (child.position && node.position) {
          emoticonNode.position = {
            start: child.position.start,
            end: node.position.end
          }
        }

        parent.children.splice(index, siblingIndex - index + 1, emoticonNode)

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
  /** @type {Array.<string>} */
  var subset
  /** @type {number} */
  var offset
  /** @type {string} */
  var char

  while (++index < emoticon.length) {
    subset = emoticon[index].emoticons
    offset = -1

    while (++offset < subset.length) {
      emoticons.push(subset[offset])

      char = subset[offset].charAt(0)
      if (!start.includes(char)) start.push(char)

      char = subset[offset].charAt(subset[offset].length - 1)
      if (!end.includes(char)) end.push(char)
    }
  }
}
