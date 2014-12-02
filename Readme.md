# nlcst-emoticon-modifier [![Build Status](https://img.shields.io/travis/wooorm/nlcst-emoticon-modifier.svg?style=flat)](https://travis-ci.org/wooorm/nlcst-emoticon-modifier) [![Coverage Status](https://img.shields.io/coveralls/wooorm/nlcst-emoticon-modifier.svg?style=flat)](https://coveralls.io/r/wooorm/nlcst-emoticon-modifier?branch=master)

Classify plain-text ASCII [**emoticon**](https://github.com/wooorm/emoticon)s as `EmoticonNode`s.

Implemented by [**retext-emoji**](https://github.com/wooorm/retext-emoji), but separated for use by standalone (non-[retext](https://github.com/wooorm/retext)) parsers.

> Note: this project is useful in combination with natural language parsers like [parse-latin](https://github.com/wooorm/parse-latin), [parse-dutch](https://github.com/wooorm/parse-dutch), and [parse-english](https://github.com/wooorm/parse-english).

## Installation

npm:
```sh
$ npm install nlcst-emoticon-modifier
```

Component.js:
```sh
$ component install wooorm/nlcst-emoticon-modifier
```

Bower:
```sh
$ bower install nlcst-emoticon-modifier
```

## Usage

```js
var modifier = require('nlcst-emoticon-modifier');
var ParseEnglish = require('parse-english');
var english = new ParseEnglish();

/* Attach the modifier. */
modifier(english);

english.parse('Who doesn’t like emoticons? :3').children[0].children;
```

Yields:

```json
[
  {
    "type": "SentenceNode",
    "children": [
      {
        "type": "WordNode",
        "children": [
          {
            "type": "TextNode",
            "value": "Who"
          }
        ]
      },
      {
        "type": "WhiteSpaceNode",
        "value": " "
      },
      {
        "type": "WordNode",
        "children": [
          {
            "type": "TextNode",
            "value": "doesn"
          },
          {
            "type": "PunctuationNode",
            "value": "’"
          },
          {
            "type": "TextNode",
            "value": "t"
          }
        ]
      },
      {
        "type": "WhiteSpaceNode",
        "value": " "
      },
      {
        "type": "WordNode",
        "children": [
          {
            "type": "TextNode",
            "value": "like"
          }
        ]
      },
      {
        "type": "WhiteSpaceNode",
        "value": " "
      },
      {
        "type": "WordNode",
        "children": [
          {
            "type": "TextNode",
            "value": "emoticons"
          }
        ]
      },
      {
        "type": "PunctuationNode",
        "value": "?"
      },
      {
        "type": "WhiteSpaceNode",
        "value": " "
      },
      {
        "type": "EmoticonNode",
        "value": ":3"
      }
    ]
  }
]
```

## Performance

On a MacBook Air, **parse-english** performs about 29% slower on content filled with emoticons, and a 14% slower on content without emoticons, when using this modifier.

```
             parse w/ modifier
  1,473 op/s » A paragraph (5 sentences, 100 words, 10 emoticons)
  1,903 op/s » A paragraph (5 sentences, 100 words, no emoticons)

             parse w/o modifier
  2,081 op/s » A paragraph (5 sentences, 100 words, 10 emoticons)
  2,215 op/s » A paragraph (5 sentences, 100 words, no emoticons)
```

## Related

- [nlcst](https://github.com/wooorm/nlcst)
- [nlcst-emoji-modifier](https://github.com/wooorm/nlcst-emoji-modifier)
- [parse-latin](https://github.com/wooorm/parse-latin)
- [parse-dutch](https://github.com/wooorm/parse-dutch)
- [parse-english](https://github.com/wooorm/parse-english)
- [retext](https://github.com/wooorm/retext)

## License

MIT © [Titus Wormer](http://wooorm.com)
