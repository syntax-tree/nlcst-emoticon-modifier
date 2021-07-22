/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Literal<string>} Literal
 */

import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {unified} from 'unified'
import retextStringify from 'retext-stringify'
import retextEnglish from 'retext-english'
import {emoticon} from 'emoticon'
import {isHidden} from 'is-hidden'
import {toString} from 'nlcst-to-string'
import {removePosition} from 'unist-util-remove-position'
import {emoticonModifier} from '../index.js'

const position = unified().use(retextEnglish).use(plugin).use(retextStringify)
const noPosition = unified()
  .use(retextEnglish)
  .use(plugin)
  .use(retextStringify)
  .use(function () {
    // @ts-expect-error: fine.
    // type-coverage:ignore-next-line
    this.Parser.prototype.position = false
  })

test('nlcst-emoticon-modifier()', (t) => {
  const root = path.join('test', 'fixtures')

  t.throws(
    () => {
      // @ts-expect-error runtime.
      emoticonModifier({})
    },
    /Missing children in `parent`/,
    'should throw when not given a parent'
  )

  const files = fs.readdirSync(root)
  let index = -1
  /** @type {Node} */
  let tree
  /** @type {string} */
  let name

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

test('emoticons', (t) => {
  let index = -1
  let offset = -1
  /** @type {Array.<string>} */
  let list
  /** @type {Node} */
  let tree
  /** @type {Literal} */
  let node

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

/**
 * Add modifier to processor.
 *
 * @type {import('unified').Plugin<[]>}
 */
function plugin() {
  // @ts-expect-error: fine.
  // type-coverage:ignore-next-line
  this.Parser.prototype.use('tokenizeSentence', emoticonModifier)
}
