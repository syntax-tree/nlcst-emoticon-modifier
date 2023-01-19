/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('../complex-types.js').Emoticon} Emoticon
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {ParseEnglish} from 'parse-english'
import {emoticon} from 'emoticon'
import {isHidden} from 'is-hidden'
import {toString} from 'nlcst-to-string'
import {emoticonModifier} from '../index.js'
import * as mod from '../index.js'

const parser = new ParseEnglish()
parser.tokenizeSentencePlugins.unshift(emoticonModifier)

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
    const input = toString(tree)

    assert.deepEqual(parser.parse(input), tree, name)
  }
})

test('emoticons', () => {
  let index = -1

  while (++index < emoticon.length) {
    const list = emoticon[index].emoticons
    let offset = -1

    while (++offset < list.length) {
      const tree = parser.parse('Who doesn’t like ' + list[offset] + '?')
      /** @type {Emoticon} */
      // @ts-expect-error: fine.
      const node = tree.children[0].children[0].children[6]

      assert.strictEqual(node.type, 'EmoticonNode', list[offset] + ' type')
      assert.strictEqual(node.value, list[offset], list[offset] + ' value')
    }
  }
})
