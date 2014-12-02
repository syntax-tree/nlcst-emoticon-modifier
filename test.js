'use strict';

/**
 * Dependencies.
 */

var modifier,
    ParseEnglish,
    emoticons,
    assert;

modifier = require('./');
ParseEnglish = require('parse-english');
emoticons = require('emoticon');
assert = require('assert');

/**
 * `ParseEnglish`.
 */

var parseEnglish;

parseEnglish = new ParseEnglish();

modifier(parseEnglish);

/**
 * Fixtures.
 */

var baseSentence,
    questionMark;

baseSentence = 'Who doesn\'t like ';
questionMark = '?';

/**
 * Tests.
 */

describe('nlcst-emoticon-modifier()', function () {
    it('should be a `function`', function () {
        assert(typeof modifier === 'function');
    });

    it('should throw when not given a parser', function () {
        assert.throws(function () {
            modifier({});
        }, /not a valid parser/);

        assert.doesNotThrow(function () {
            modifier(new ParseEnglish());
        });
    });

    it('should classify emoticons (`:)`) as an `EmoticonNode`', function () {
        var tree;

        tree = parseEnglish.parse('This makes me feel :).');

        assert(
            JSON.stringify(tree.children[0].children[0].children) ===
            JSON.stringify([
                {
                    'type': 'WordNode',
                    'children': [
                        {
                            'type': 'TextNode',
                            'value': 'This'
                        }
                    ]
                },
                {
                    'type': 'WhiteSpaceNode',
                    'value': ' '
                },
                {
                    'type': 'WordNode',
                    'children': [
                        {
                            'type': 'TextNode',
                            'value': 'makes'
                        }
                    ]
                },
                {
                    'type': 'WhiteSpaceNode',
                    'value': ' '
                },
                {
                    'type': 'WordNode',
                    'children': [
                        {
                            'type': 'TextNode',
                            'value': 'me'
                        }
                    ]
                },
                {
                    'type': 'WhiteSpaceNode',
                    'value': ' '
                },
                {
                    'type': 'WordNode',
                    'children': [
                        {
                            'type': 'TextNode',
                            'value': 'feel'
                        }
                    ]
                },
                {
                    'type': 'WhiteSpaceNode',
                    'value': ' '
                },
                {
                    'type': 'EmoticonNode',
                    'value': ':)'
                },
                {
                    'type': 'PunctuationNode',
                    'value': '.'
                }
            ])
        );
    });

    it('should NOT classify invalid gemoji (`):` and `: (`) as an ' +
        '`EmoticonNode`',
        function () {
            var tree;

            tree = parseEnglish.parse(
                'Well: (This makes me feel):.'
            );

            assert(
                JSON.stringify(tree.children[0].children[0].children) ===
                JSON.stringify([
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'Well'
                            }
                        ]
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': ':'
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': '('
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'This'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'makes'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'me'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'feel'
                            }
                        ]
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': ')'
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': ':'
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': '.'
                    }
                ])
            );
        }
    );

    it('should classify two adjacent unicode emoji ' +
        '(`:) :(`) as two `EmoticonNode`s',
        function () {
            var tree;

            tree = parseEnglish.parse(
                'This makes me feel :) :(.'
            );

            assert(
                JSON.stringify(tree.children[0].children[0].children) ===
                JSON.stringify([
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'This'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'makes'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'me'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'feel'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'EmoticonNode',
                        'value': ':)'
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'EmoticonNode',
                        'value': ':('
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': '.'
                    }
                ])
            );
        }
    );

    it('should classify emoticons at sentence start as an `EmoticonNode`',
        function () {
            var tree;

            tree = parseEnglish.parse('<3 I\'m going to bed.');

            assert(
                JSON.stringify(tree.children[0].children[0].children) ===
                JSON.stringify([
                    {
                        'type': 'EmoticonNode',
                        'value': '<3'
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'I'
                            },
                            {
                                'type': 'PunctuationNode',
                                'value': '\''
                            },
                            {
                                'type': 'TextNode',
                                'value': 'm'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'going'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'to'
                            }
                        ]
                    },
                    {
                        'type': 'WhiteSpaceNode',
                        'value': ' '
                    },
                    {
                        'type': 'WordNode',
                        'children': [
                            {
                                'type': 'TextNode',
                                'value': 'bed'
                            }
                        ]
                    },
                    {
                        'type': 'PunctuationNode',
                        'value': '.'
                    }
                ])
            );
        }
    );
});

function describeEmoticon(value) {
    describe(value, function () {
        it('should classify `' + value + '` as an `EmoticonNode`',
            function () {
                var tree,
                    node;

                tree = parseEnglish.parse(
                    baseSentence + value + questionMark
                );

                node = tree.children[0].children[0].children[6];

                assert(node.type === 'EmoticonNode');
                assert(node.value === value);
            }
        );
    });
}

Object.keys(emoticons.emoticon).forEach(describeEmoticon);
