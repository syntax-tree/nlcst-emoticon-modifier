'use strict';

/* eslint-env mocha */

var assert = require('assert');
var retext = require('retext');
var english = require('retext-english');
var emoticons = require('emoticon');
var modifier = require('..');

var smile = require('./fixtures/smile');
var invalid = require('./fixtures/invalid');
var adjacent = require('./fixtures/adjacent');
var sentenceStart = require('./fixtures/sentence-start');

/* Processors. */
var position = retext(english).use(plugin);
var noPosition = retext(english).use(plugin).use(function (instance) {
  instance.Parser.prototype.position = false;
});

/*
 * Tests.
 */

describe('nlcst-emoticon-modifier()', function () {
  it('should throw when not given a parent', function () {
    assert.throws(
      function () {
        modifier({});
      },
      /Missing children in `parent`/
    );
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
    it(
      'should classify `' + value + '` as an `EmoticonNode`',
      function () {
        var node = process('Who doesn’t like ' + value + '?', position);
        var emoticon = node.children[0].children[0].children[6];

        assert.strictEqual(emoticon.type, 'EmoticonNode');
        assert.strictEqual(emoticon.value, value);
      }
    );
  });
});

/* Short-cut to access the CST. */
function check(fixture, node) {
  assert.deepEqual(position.run(position.parse(fixture)), node);
  assert.deepEqual(noPosition.run(noPosition.parse(fixture, {position: false})), clean(node));
}

/* Add modifier to processor. */
function plugin(processor) {
  processor.Parser.prototype.use('tokenizeSentence', modifier);
}

/* Clone `object` but omit positional information. */
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
