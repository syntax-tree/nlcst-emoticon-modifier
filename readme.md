# nlcst-emoticon-modifier

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**nlcst**][nlcst] utility to classify ASCII [emoticon][]s as `EmoticonNode`s.

> **Note**: You probably want to use [retext-emoji][].

## Install

[npm][]:

```sh
npm install nlcst-emoticon-modifier
```

## Use

```js
var modifier = require('nlcst-emoticon-modifier')
var inspect = require('unist-util-inspect')
var english = require('parse-english')

var sentence = english().parse('This makes me feel :).').children[0].children[0]

modifier(sentence)

console.log(inspect(sentence))
```

Yields:

```txt
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

Classify ASCII [emoticon][]s as `EmoticonNode`s.

##### Parameters

###### `sentence`

Node to process ([`Sentence`][sentence]).

## Related

*   [`nlcst-affix-emoticon-modifier`](https://github.com/syntax-tree/nlcst-affix-emoticon-modifier)
    — Merge affix emoticons into the previous sentence in nlcst
*   [`nlcst-emoji-modifier`](https://github.com/syntax-tree/nlcst-emoji-modifier)
    — Support emoji

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/nlcst-emoticon-modifier/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/nlcst-emoticon-modifier/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/nlcst-emoticon-modifier.svg

[coverage]: https://codecov.io/github/syntax-tree/nlcst-emoticon-modifier

[downloads-badge]: https://img.shields.io/npm/dm/nlcst-emoticon-modifier.svg

[downloads]: https://www.npmjs.com/package/nlcst-emoticon-modifier

[size-badge]: https://img.shields.io/bundlephobia/minzip/nlcst-emoticon-modifier.svg

[size]: https://bundlephobia.com/result?p=nlcst-emoticon-modifier

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[retext-emoji]: https://github.com/retextjs/retext-emoji

[nlcst]: https://github.com/syntax-tree/nlcst

[sentence]: https://github.com/syntax-tree/nlcst#sentence

[emoticon]: https://github.com/wooorm/emoticon
