// Run: node tests/auto-tag.test.js
import assert from 'assert'
import { stripTags, wordsOnly } from '../lib/tags.js'

assert.strictEqual(stripTags('[excited] नमस्ते साथीहरू'), 'नमस्ते साथीहरू')
assert.strictEqual(stripTags('a [long pause] b'), 'a b')
assert.strictEqual(stripTags('[देवनागरी] शब्द'), '[देवनागरी] शब्द')   // not a tag: still billed
assert.strictEqual(stripTags('[this is far too long to be a tag name ok]'), '[this is far too long to be a tag name ok]')
assert.strictEqual(wordsOnly('[calm] नमस्ते... [pause] साथी।'), wordsOnly('नमस्ते साथी'))
assert.notStrictEqual(wordsOnly('नमस्ते साथी [pause]'), wordsOnly('नमस्ते मित्र'))
console.log('auto-tag tests passed')
