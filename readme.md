# nlcst-emoticon-modifier [![Build Status](https://img.shields.io/travis/wooorm/nlcst-emoticon-modifier.svg)](https://travis-ci.org/wooorm/nlcst-emoticon-modifier) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/nlcst-emoticon-modifier.svg)](https://codecov.io/github/wooorm/nlcst-emoticon-modifier)

Classify plain-text ASCII [**emoticon**](https://github.com/wooorm/emoticon)s
as `EmoticonNode`s.

Implemented by [retext-emoji](https://github.com/wooorm/retext-emoji), but
separated for use by standalone (non-[retext](https://github.com/wooorm/retext))
processing.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install nlcst-emoticon-modifier
```

**nlcst-emoticon-modifier** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](nlcst-emoticon-modifier.js) and [compressed](nlcst-emoticon-modifier.min.js).

## Usage

```javascript
var modifier = require('nlcst-emoticon-modifier');
var inspect = require('unist-util-inspect');
var english = require('parse-english');
var sentence = english().parse('This makes me feel :).').children[0].children[0];

modifier(sentence);

console.log(inspect(sentence));
```

Yields:

```text
SentenceNode[10]
├─ WordNode[1]
│  └─ TextNode: 'This'
├─ WhiteSpaceNode: ' '
├─ WordNode[1]
│  └─ TextNode: 'makes'
├─ WhiteSpaceNode: ' '
├─ WordNode[1]
│  └─ TextNode: 'me'
├─ WhiteSpaceNode: ' '
├─ WordNode[1]
│  └─ TextNode: 'feel'
├─ WhiteSpaceNode: ' '
├─ EmoticonNode: ':)'
└─ PunctuationNode: '.'
```

## API

### emoticonModifier(sentence)

Classify plain-text ASCII [**emoticon**](https://github.com/wooorm/emoticon)s
as `EmoticonNode`s.

**Parameters**

*   `sentence` ([`NLCSTSentenceNode`](https://github.com/wooorm/nlcst#sentencenode))
    — Node with children.

**Throws**

*   `Error` — When not given a parent node.

## Related

*   [nlcst](https://github.com/wooorm/nlcst);
*   [nlcst-emoji-modifier](https://github.com/wooorm/nlcst-emoji-modifier);
*   [nlcst-affix-emoticon-modifier](https://github.com/wooorm/nlcst-affix-emoticon-modifier);
*   [retext](https://github.com/wooorm/retext).

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
