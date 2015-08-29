'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var english = require('retext-english');
var emoticons = require('emoticon');
var modifier = require('..');

/*
 * Methods.
 */

var dequal = assert.deepEqual;
var equal = assert.strictEqual;

/*
 * Fixtures.
 */

var smile = require('./fixtures/smile');
var invalid = require('./fixtures/invalid');
var adjacent = require('./fixtures/adjacent');
var sentenceStart = require('./fixtures/sentence-start');
var base = 'Who doesn’t like ';
var marker = '?';

/**
 * Clone `object` but omit positional information.
 *
 * @param {Object|Array} object - Object to clone.
 * @return {Object|Array} - `object`, without positional
 *   information.
 */
function clean(object) {
    var clone = 'length' in object ? [] : {};
    var key;
    var value;

    for (key in object) {
        value = object[key];

        if (key === 'position') {
            continue;
        }

        clone[key] = typeof object[key] === 'object' ? clean(value) : value;
    }

    return clone;
}

/**
 * Add modifier to processor.
 */
function plugin(processor) {
    processor.Parser.prototype.use('tokenizeSentence', modifier);
}

/*
 * Processors.
 */

var position = retext(english).use(plugin);
var noPosition = retext(english).use(plugin).use(function (instance) {
    instance.Parser.prototype.position = false;
});

/**
 * Short-cut to access the CST.
 */
function process(fixture, processor) {
    var cst;

    processor.process(fixture, function (err, file) {
        /* istanbul ignore next */
        if (err) {
            throw err;
        }

        cst = file.namespace('retext').cst;
    });

    return cst;
}

/**
 * Short-cut to access the CST.
 */
function check(fixture, node) {
    dequal(process(fixture, position), node);
    dequal(process(fixture, noPosition), clean(node));
}

/*
 * Tests.
 */

describe('nlcst-emoticon-modifier()', function () {
    it('should throw when not given a parent', function () {
        assert.throws(function () {
            modifier({});
        }, /Missing children in `parent/);
    });

    it('should classify emoticons (`:)`)', function () {
        check('This makes me feel :).', smile);
    });

    it('should NOT classify invalid emoticons (`):` and `: (`)', function () {
        check('Well: (This makes me feel):.', invalid);
    });

    it('should classify adjacent emoticons (`:) :(`)', function () {
        check('This makes me feel :) :(.', adjacent);
    });

    it('should classify emoticons at sentence start', function () {
        check('<3 I’m going to bed.', sentenceStart);
    });
});

/*
 * Check all emoticons.
 */

Object.keys(emoticons.emoticon).forEach(function (value) {
    describe(value, function () {
        it('should classify `' + value + '` as an `EmoticonNode`',
            function () {
                var node = process(base + value + marker, position);
                var emoticon = node.children[0].children[0].children[6];

                equal(emoticon.type, 'EmoticonNode');
                equal(emoticon.value, value);
            }
        );
    });
});
