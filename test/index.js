import fs from 'fs'
import path from 'path'
import test from 'tape'
import unified from 'unified'
import stringify from 'retext-stringify'
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
    this.Parser.prototype.position = false
  })

test('nlcst-emoticon-modifier()', function (t) {
  var root = path.join('test', 'fixtures')

  t.throws(
    function () {
      emoticonModifier({})
    },
    /Missing children in `parent`/,
    'should throw when not given a parent'
  )

  var files = fs.readdirSync(root)
  var index = -1
  var tree
  var name

  while (++index < files.length) {
    if (isHidden(files[index])) continue

    tree = JSON.parse(fs.readFileSync(path.join(root, files[index])))
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
  var list
  var fixture
  var tree
  var node

  while (++index < emoticon.length) {
    list = emoticon[index].emoticons
    offset = -1

    while (++offset < list.length) {
      fixture = 'Who doesn’t like ' + list[offset] + '?'
      tree = position.runSync(position.parse(fixture))
      node = tree.children[0].children[0].children[6]

      t.strictEqual(node.type, 'EmoticonNode', list[offset] + ' type')
      t.strictEqual(node.value, list[offset], list[offset] + ' value')
    }
  }

  t.end()
})

/* Add modifier to processor. */
function plugin() {
  this.Parser.prototype.use('tokenizeSentence', emoticonModifier)
}
