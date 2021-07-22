/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal<string>} Literal
 */

import fs from 'fs'
import path from 'path'
import test from 'tape'
import unified from 'unified'
// @ts-expect-error remove when typed.
import stringify from 'retext-stringify'
// @ts-expect-error remove when typed.
import english from 'retext-english'
import {emoticon} from 'emoticon'
import {isHidden} from 'is-hidden'
import {toString} from 'nlcst-to-string'
import {removePosition} from 'unist-util-remove-position'
import {emoticonModifier} from '../index.js'

var position = unified().use(english).use(plugin).use(stringify)
var noPosition = unified()
  .use(english)
  .use(plugin)
  .use(stringify)
  .use(function () {
    // type-coverage:ignore-next-line
    this.Parser.prototype.position = false
  })

test('nlcst-emoticon-modifier()', function (t) {
  var root = path.join('test', 'fixtures')

  t.throws(
    function () {
      // @ts-expect-error runtime.
      emoticonModifier({})
    },
    /Missing children in `parent`/,
    'should throw when not given a parent'
  )

  var files = fs.readdirSync(root)
  var index = -1
  /** @type {Node} */
  var tree
  /** @type {string} */
  var name

  while (++index < files.length) {
    if (isHidden(files[index])) continue

    tree = JSON.parse(String(fs.readFileSync(path.join(root, files[index]))))
    name = path.basename(files[index], path.extname(files[index]))

    t.deepLooseEqual(position.parse(toString(tree)), tree, name)
    t.deepLooseEqual(
      noPosition.parse(toString(tree)),
      removePosition(tree, true),
      name + ' (positionless)'
    )
  }

  t.end()
})

test('emoticons', function (t) {
  var index = -1
  var offset = -1
  /** @type {Array.<string>} */
  var list
  /** @type {Node} */
  var tree
  /** @type {Literal} */
  var node

  while (++index < emoticon.length) {
    list = emoticon[index].emoticons
    offset = -1

    while (++offset < list.length) {
      tree = position.runSync(
        position.parse('Who doesn’t like ' + list[offset] + '?')
      )
      // @ts-expect-error: hush
      node = tree.children[0].children[0].children[6]

      t.strictEqual(node.type, 'EmoticonNode', list[offset] + ' type')
      t.strictEqual(node.value, list[offset], list[offset] + ' value')
    }
  }

  t.end()
})

/* Add modifier to processor. */
function plugin() {
  // type-coverage:ignore-next-line
  this.Parser.prototype.use('tokenizeSentence', emoticonModifier)
}
