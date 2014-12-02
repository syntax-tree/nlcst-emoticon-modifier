'use strict';

/**
 * Dependencies.
 */

var modifier,
    ParseEnglish;

modifier = require('./');
ParseEnglish = require('parse-english');

/**
 * `ParseEnglish`.
 */

var parseEnglish,
    emoticonParseEnglish;

parseEnglish = new ParseEnglish();
emoticonParseEnglish = new ParseEnglish();

modifier(emoticonParseEnglish);

/**
 * Fixtures.
 *
 * Source:
 *   http://www.gutenberg.org/cache/epub/11024/pg11024.html
 */

var paragraph,
    emoticonParagraph;

/**
 * A paragraph, 5 sentences, filled with emoticons.
 */

emoticonParagraph = 'Thou art a churlish knight to so ' +
    'affront a <\\3 he could not sit upon his ]:( any ' +
    'longer. ' +

    'For methinks something hath befallen my :3 and ' +
    'that he then, after a while, he :,( out in great ' +
    'voice. ' +

    'For that 8) in the sky lieth in the south then ' +
    'Queen Helen fell down in a swoon, and ,:). ' +

    'Touch me not, for I am not mortal, but o:) so the ' +
    ']:) of the Lake ran away, everything behind. ' +

    'Where she had stood was clear ;), and she was ' +
    'gone since =3 does not choose to assume my ' +
    'quarrel.';

/**
 * A paragraph, 5 sentences, without emoticons.
 */

paragraph = 'Thou art a churlish knight to so affront ' +
    'a lady he could not sit upon his horse any ' +
    'longer. ' +

    'For methinks something hath befallen my lord ' +
    'and that he then, after a while, he cried out ' +
    'in great voice. ' +

    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and ' +
    'lay. ' +

    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, ' +
    'everything behind. ' +

    'Where she had stood was clear, and she was ' +
    'gone since Sir Kay does not choose to assume my ' +
    'quarrel.';
/**
 * Benchmarks.
 */

suite('parse w/ modifier', function () {
    bench('A paragraph (5 sentences, 100 words, 10 emoticons)',
        function () {
            emoticonParseEnglish.parse(emoticonParagraph);
        }
    );

    bench('A paragraph (5 sentences, 100 words, no emoticons)',
        function () {
            emoticonParseEnglish.parse(paragraph);
        }
    );
});

suite('parse w/o modifier', function () {
    bench('A paragraph (5 sentences, 100 words, 10 emoticons)',
        function () {
            parseEnglish.parse(emoticonParagraph);
        }
    );

    bench('A paragraph (5 sentences, 100 words, no emoticons)',
        function () {
            parseEnglish.parse(paragraph);
        }
    );
});
