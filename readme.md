# nlcst-emoticon-modifier

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[nlcst][] utility to classify [ASCII emoticon][wooorm-emoticon]s as `EmoticonNode`s.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`emoticonModifier(node)`](#emoticonmodifiernode)
    *   [`Emoticon`](#emoticon)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This utility searches for emoticons made with punctuation marks and symbols,
and turns them into separate nodes.

## When should I use this?

This package is a tiny utility that helps when dealing with plain-text emoticons
in natural language.
The plugin [`retext-emoji`][retext-emoji] wraps this utility and others at a
higher-level (easier) abstraction.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install nlcst-emoticon-modifier
```

In Deno with [`esm.sh`][esmsh]:

```js
import {emoticonModifier} from 'https://esm.sh/nlcst-emoticon-modifier@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {emoticonModifier} from 'https://esm.sh/nlcst-emoticon-modifier@3?bundle'
</script>
```

## Use

```js
import {emoticonModifier} from 'nlcst-emoticon-modifier'
import {ParseEnglish} from 'parse-english'
import {inspect} from 'unist-util-inspect'

const parser = new ParseEnglish()
parser.tokenizeSentencePlugins.unshift(emoticonModifier)

const sentence = parser.parse('This makes me feel :).').children[0].children[0]

console.log(inspect(sentence))
```

Yields:

```txt
SentenceNode[10] (1:1-1:23, 0-22)
├─0 WordNode[1] (1:1-1:5, 0-4)
│   └─0 TextNode "This" (1:1-1:5, 0-4)
├─1 WhiteSpaceNode " " (1:5-1:6, 4-5)
├─2 WordNode[1] (1:6-1:11, 5-10)
│   └─0 TextNode "makes" (1:6-1:11, 5-10)
├─3 WhiteSpaceNode " " (1:11-1:12, 10-11)
├─4 WordNode[1] (1:12-1:14, 11-13)
│   └─0 TextNode "me" (1:12-1:14, 11-13)
├─5 WhiteSpaceNode " " (1:14-1:15, 13-14)
├─6 WordNode[1] (1:15-1:19, 14-18)
│   └─0 TextNode "feel" (1:15-1:19, 14-18)
├─7 WhiteSpaceNode " " (1:19-1:20, 18-19)
├─8 EmoticonNode ":)" (1:20-1:22, 19-21)
└─9 PunctuationNode "." (1:22-1:23, 21-22)
```

## API

This package exports the identifier
[`emoticonModifier`][api-emoticon-modifier].
There is no default export.

### `emoticonModifier(node)`

Merge emoticons in a `SentenceNode` into `EmoticonNode`s.

###### Parameters

*   `node` ([`Sentence`][sentence])
    — nlcst sentence to transform

###### Returns

Nothing (`undefined`).

### `Emoticon`

Emoticon node (TypeScript type).

###### Type

```ts
import type {Data, Literal} from 'nlcst'

interface Emoticon extends Literal {
  type: 'EmoticonNode'
  data?: EmoticonData | undefined
}

interface EmoticonData extends Data {}
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Emoticon`][api-emoticon].

It also registers the `Emoticon` node type with `@types/nlcst` in
`SentenceContentMap`.
If you’re working with the syntax tree, make sure to import this utility
somewhere in your types, as that registers the new node types in the tree.

```js
/**
 * @typedef {import('nlcst-emoticon-modifier')}
 */

import {visit} from 'unist-util-visit'

/** @type {import('nlcst').Root} */
const tree = getNodeSomeHow()

visit(tree, function (node) {
  // `node` can now be a `Emoticon` node.
})
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`nlcst-emoticon-modifier@^3`, compatible with Node.js 16.

## Related

*   [`nlcst-affix-emoticon-modifier`](https://github.com/syntax-tree/nlcst-affix-emoticon-modifier)
    — merge affix emoticons into the previous sentence in nlcst
*   [`nlcst-emoji-modifier`](https://github.com/syntax-tree/nlcst-emoji-modifier)
    — support emoji

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
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

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=nlcst-emoticon-modifier

[size]: https://bundlejs.com/?q=nlcst-emoticon-modifier

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[retext-emoji]: https://github.com/retextjs/retext-emoji

[nlcst]: https://github.com/syntax-tree/nlcst

[sentence]: https://github.com/syntax-tree/nlcst#sentence

[wooorm-emoticon]: https://github.com/wooorm/emoticon

[api-emoticon-modifier]: #emoticonmodifiernode

[api-emoticon]: #emoticon
