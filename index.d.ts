import type {Literal} from 'nlcst'

/**
 * Emoticon node.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Emoticon extends Literal {
  type: 'EmoticonNode'
}

declare module 'nlcst' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SentenceContentMap {
    emoticon: Emoticon
  }
}

export {emoticonModifier} from './lib/index.js'
