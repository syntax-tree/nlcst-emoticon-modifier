# nlcst-emoticon-modifier [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Classify plain-text ASCII [**emoticon**][emoticon]s
as `EmoticonNode`s.

Implemented by [**retext-emoji**][retext-emoji], but separated for use by
standalone (non-retext) processing.

## Installation

[npm][]:

```bash
npm install nlcst-emoticon-modifier
```

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

### `emoticon(sentence)`

Classify plain-text ASCII [**emoticon**][emoticon]s as `EmoticonNode`s.

###### Parameters

*   `sentence` ([`NLCSTSentenceNode`][sentence]).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/nlcst-emoticon-modifier.svg

[travis]: https://travis-ci.org/syntax-tree/nlcst-emoticon-modifier

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-emoticon-modifier.svg

[codecov]: https://codecov.io/github/syntax-tree/nlcst-emoticon-modifier

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext-emoji]: https://github.com/wooorm/retext-emoji

[sentence]: https://github.com/syntax-tree/nlcst#paragrap

[emoticon]: https://github.com/wooorm/emoticon
