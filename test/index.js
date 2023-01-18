/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('../complex-types.js').Emoticon} Emoticon
 */

// To do: use `strict` when `retext` updates to expose instances.
import assert from 'node:assert'
import fs from 'node:fs/promises'
import test from 'node:test'
import {unified} from 'unified'
import retextStringify from 'retext-stringify'
import retextEnglish from 'retext-english'
import {emoticon} from 'emoticon'
import {isHidden} from 'is-hidden'
import {toString} from 'nlcst-to-string'
import {removePosition} from 'unist-util-remove-position'
import {emoticonModifier} from '../index.js'
import * as mod from '../index.js'

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

test('emoticonModifier', async () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['emoticonModifier'],
    'should expose the public api'
  )

  const root = new URL('fixtures/', import.meta.url)

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      emoticonModifier({})
    },
    /Missing children in `parent`/,
    'should throw when not given a parent'
  )

  const files = await fs.readdir(root)
  let index = -1

  while (++index < files.length) {
    const file = files[index]

    if (isHidden(file)) continue

    /** @type {Root} */
    const tree = JSON.parse(String(await fs.readFile(new URL(file, root))))
    const name = file.split('.').slice(0, -1).join('.')

    assert.deepEqual(position.parse(toString(tree)), tree, name)
    assert.deepEqual(
      noPosition.parse(toString(tree)),
      removePosition(tree, true),
      name + ' (positionless)'
    )
  }
})

test('emoticons', () => {
  let index = -1

  while (++index < emoticon.length) {
    const list = emoticon[index].emoticons
    let offset = -1

    while (++offset < list.length) {
      const tree = /** @type {Root} */ (
        position.runSync(
          position.parse('Who doesn’t like ' + list[offset] + '?')
        )
      )
      /** @type {Emoticon} */
      // @ts-expect-error: fine.
      const node = tree.children[0].children[0].children[6]

      assert.strictEqual(node.type, 'EmoticonNode', list[offset] + ' type')
      assert.strictEqual(node.value, list[offset], list[offset] + ' value')
    }
  }
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
