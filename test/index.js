/**
 * @typedef {import('nlcst').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {ParseEnglish} from 'parse-english'
import {emoticon} from 'emoticon'
import {isHidden} from 'is-hidden'
import {toString} from 'nlcst-to-string'
import {emoticonModifier} from '../index.js'

const parser = new ParseEnglish()
parser.tokenizeSentencePlugins.unshift(emoticonModifier)

test('emoticonModifier', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('../index.js')).sort(), [
      'emoticonModifier'
    ])
  })
})

test('fixtures', async function (t) {
  const root = new URL('fixtures/', import.meta.url)
  const files = await fs.readdir(root)
  let index = -1

  while (++index < files.length) {
    const file = files[index]

    if (isHidden(file)) continue

    const name = file.split('.').slice(0, -1).join('.')

    await t.test(name, async function () {
      /** @type {Root} */
      const tree = JSON.parse(String(await fs.readFile(new URL(file, root))))
      const input = toString(tree)

      assert.deepEqual(parser.parse(input), tree)
    })
  }
})

test('emoticons', async function (t) {
  let index = -1

  while (++index < emoticon.length) {
    const list = emoticon[index].emoticons
    let offset = -1

    while (++offset < list.length) {
      const value = list[offset]

      await t.test(value, async function () {
        const tree = parser.parse('Who doesn’t like ' + value + '?')
        const paragraph = tree.children[0]
        assert(paragraph.type === 'ParagraphNode')
        const sentence = paragraph.children[0]
        assert(sentence.type === 'SentenceNode')
        const node = sentence.children[6]
        assert(node.type === 'EmoticonNode')

        assert.equal(node.value, value)
      })
    }
  }
})
