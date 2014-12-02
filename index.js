'use strict';

/**
 * Dependencies.
 */

var information,
    nlcstToString;

information = require('./data/emoticon.json');
nlcstToString = require('nlcst-to-string');

/**
 * Constants: node types.
 */

var EMOTICON_NODE;

EMOTICON_NODE = 'EmoticonNode';

/**
 * Constants: magic numbers.
 *
 * Emoticons are treated by a parser as multiple nodes.
 * Because this modifier walks forwards, when a non-
 * emoticon matches it would normaly walk to the end
 * (the last node). However, because the longest emoticon
 * is tokenized as `Punctuation` (eyes), `Punctuation`
 * (a tear), `Punctuation` (another tear), `Punctuation`
 * (a nose), and `Punctuation` (a frowning mouth), we can
 * safely break when the modifier has walked 5 characters.
 */

var MAX_EMOTICON_LENGTH;

MAX_EMOTICON_LENGTH = 5;

/**
 * Constants: info.
 */

var emoticons,
    start,
    end;

emoticons = information.emoticons;
start = information.start;
end = information.end;

start = new RegExp(start.join('|'));

/**
 * Merge emoticons into an `EmoticonNode`.
 *
 * @param {CSTNode} child
 * @param {number} index
 * @param {CSTNode} parent
 * @return {undefined|number} - Either void, or the
 *   next index to iterate over.
 */

function mergeEmoticons(child, index, parent) {
    var siblings,
        siblingIndex,
        node,
        value,
        subvalue;

    /**
     * Check if `child`s first character could be used
     * to start an emoticon.
     */

    if (start.test(nlcstToString(child).charAt(0))) {
        siblings = parent.children;

        value = '';

        siblingIndex = index;

        node = child;

        while (node) {
            if (value.length >= MAX_EMOTICON_LENGTH) {
                return;
            }

            subvalue = nlcstToString(node);

            value += subvalue;

            /**
             * The second test, if the last character of
             * the current node is superfluous but
             * improves performance by 30%.
             */

            if (
                node.type !== EMOTICON_NODE &&
                end.indexOf(subvalue.charAt(subvalue.length - 1)) !== -1 &&
                emoticons.indexOf(value) !== -1
            ) {
                siblings.splice(index, siblingIndex - index + 1, {
                    'type': EMOTICON_NODE,
                    'value': value
                });

                /**
                 * Some emoticons, like `:-`, can be followed by
                 * more characters to form other emoticons.
                 */

                return index - 1;
            }

            node = siblings[++siblingIndex];
        }
    }
}

var emoticonModifier;

function attach(parser) {
    if (!parser || !parser.parse) {
        throw new Error(
            '`parser` is not a valid parser for ' +
            '`attach(parser)`. Make sure something ' +
            'like `parse-latin` is passed.'
        );
    }

    /**
     * Make sure to not re-attach the modifiers.
     */

    if (!emoticonModifier) {
        emoticonModifier = parser.constructor.modifier(mergeEmoticons);
    }

    parser.useFirst('tokenizeSentence', emoticonModifier);
}

/**
 * Expose `attach`.
 */

module.exports = attach;
