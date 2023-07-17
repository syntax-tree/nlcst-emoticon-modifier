import type {Data, Literal} from 'nlcst'

// Expose runtime code.
export {emoticonModifier} from './lib/index.js'

/**
 * Emoticon node.
 */
export interface Emoticon extends Literal {
  /**
   * Node type of emoticon node.
   */
  type: 'EmoticonNode'

  /**
   * Data associated by the ecosystem.
   */
  data?: EmoticonData | undefined
}

/**
 * Emoticon node data.
 */
export interface EmoticonData extends Data {}

// Register node type.
declare module 'nlcst' {
  interface RootContentMap {
    emoticon: Emoticon
  }

  interface SentenceContentMap {
    emoticon: Emoticon
  }
}
