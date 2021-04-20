'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var unified = require('unified')
var stringify = require('retext-stringify')
var english = require('retext-english')
var emoticons = require('emoticon')
var hidden = require('is-hidden')
var toString = require('nlcst-to-string')
var modifier = require('..')

var position = unified().use(english).use(plugin).use(stringify)
var noPosition = unified()
  .use(english)
  .use(plugin)
  .use(stringify)
  .use(function () {
    this.Parser.prototype.position = false
  })

test('nlcst-emoticon-modifier()', function (t) {
  var root = path.join(__dirname, 'fixtures')

  t.throws(
    function () {
      modifier({})
    },
    /Missing children in `parent`/,
    'should throw when not given a parent'
  )

  var files = fs.readdirSync(root)
  var index = -1
  var tree
  var name

  while (++index < files.length) {
    if (hidden(files[index])) continue

    tree = JSON.parse(fs.readFileSync(path.join(root, files[index])))
    name = path.basename(files[index], path.extname(files[index]))

    t.deepLooseEqual(position.parse(toString(tree)), tree, name)
    t.deepLooseEqual(
      noPosition.parse(toString(tree)),
      clean(tree),
      name + ' (positionless)'
    )
  }

  t.end()
})

test('emoticons', function (t) {
  var index = -1
  var offset = -1
  var emoticon
  var fixture
  var tree
  var node

  while (++index < emoticons.length) {
    emoticon = emoticons[index].emoticons
    offset = -1

    while (++offset < emoticon.length) {
      fixture = 'Who doesn’t like ' + emoticon[offset] + '?'
      tree = position.runSync(position.parse(fixture))
      node = tree.children[0].children[0].children[6]

      t.strictEqual(node.type, 'EmoticonNode', emoticon[offset] + ' type')
      t.strictEqual(node.value, emoticon[offset], emoticon[offset] + ' value')
    }
  }

  t.end()
})

/* Add modifier to processor. */
function plugin() {
  this.Parser.prototype.use('tokenizeSentence', modifier)
}

/* Clone `object` but omit positional information. */
function clean(object) {
  var clone = 'length' in object ? [] : {}
  var key
  var value

  for (key in object) {
    value = object[key]

    if (key === 'position') {
      continue
    }

    clone[key] = typeof object[key] === 'object' ? clean(value) : value
  }

  return clone
}
