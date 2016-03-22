import assert						from 'assert'
// import KeyMapping					from '../src/TailoredKeymapping.class.js'
import KeyMapping					from '../src/TailoredKeymapping.class.js'

// keymaps used in tests
import keymapSubtrees				from './keymaps/keymapSubtrees'
import keymapBasic					from './keymaps/keymapBasic'
import keymapBasicFlat 				from './keymaps/keymapBasicFlat'

// const keymapping = new KeyMapping(keymapBasic)
let testData = {
	foo: 'foo_content'
,	bar: 'bar_content'
}
let dataMapped, result

// global instance with 'fake'-keymap
const _keymapping = new KeyMapping({nothing: null})

describe('OPTIONS', () => {

	context('Keymap', ()=> {

		context('* change Keymap after initialisation', ()=> {
			it('should process with new map', function(done) {
				// change keymap
				_keymapping.setKeymap(keymapBasicFlat)
				// process afterwards
				dataMapped 	= _keymapping.map(testData)
				result 		= _keymapping.getKeymapSubtree()
				// check keymap subtree
				assert.equal(result.foo, 'bar')
				done()
			})
		})
		context('Subtrees', ()=> {
			console.log('getKEymap outer', _keymapping.getKeymap())
			// broken context - doesn't set the keymap for underlying contexts... i dont know why :(
			// _keymapping.setKeymap(keymapSubtrees)
			context('* select subtree per string', ()=> {
				it('should pick the right subtree', (done) => {
					_keymapping.setKeymap(keymapSubtrees)
					dataMapped 	= _keymapping.map(testData, {
						'keymapTree': 'test'
					})
					result 		= _keymapping.getKeymapSubtree()
					// picked the right keymap subtree?
					assert.equal(result.subtree.foo, 'bar')
					done()
				})
			})
			context('* select subtree per array', ()=> {
				it('should pick the right subtree', (done) => {
					_keymapping.setKeymap(keymapSubtrees)
					dataMapped 	= _keymapping.map(testData, {
						'keymapTree': ['test', 'subtree']
					})
					result 		= _keymapping.getKeymapSubtree()
					// picked the right keymap subtree?
					assert.equal(result.foo, 'bar')
					done()
				})
			})
			context('* select wrong subtree', ()=> {
				context('* per string \'mykey\'', ()=> {
					it('should throw [Error: [TailoredKeymapping] \'keymap.mykey\' not found or invalid]', function(done) {
						// doesn't fail on wrong error msg (third parameter)
						//
						// assert.throws(()=>{
						// 	_keymapping.setKeymap(keymapBasic)
						// 	dataMapped 	= _keymapping.map(testData, {
						// 		'keymapTree': 'mykey'
						// 	})
						// }, Error, '\'keymap.mykey\' not found or invalid')

						let _err = {message: ''}
						try {
							_keymapping.setKeymap(keymapBasic)
							dataMapped 	= _keymapping.map(testData, {
								'keymapTree': 'mykey'
							})
						}
						catch(err) {
							_err = err
						}
						assert.equal(_err.message.indexOf('\'keymap.mykey\' not found or invalid') !== -1, true)
						done()
					})
				})
				context('* per array [\'test\', \'foo\', \'mykey\'] (foo is invalid)', ()=> {
					it('should throw [Error: [TailoredKeymapping] \'keymap.test.foo\' not found or invalid]', function(done) {
						let _err = {message: ''}
						try {
							_keymapping.setKeymap(keymapBasic)
							dataMapped 	= _keymapping.map(testData, {
								'keymapTree': ['test', 'foo', 'mykey']
							})
						}
						catch(err) {
							_err = err
						}
						// keymap.test.FOO is invalid (no object) so 'mykey' gets ignored
						assert.equal(_err.message.indexOf('\'keymap.test.foo\' not found or invalid') !== -1, true)
						done()
					})
				})
			}) // ENDOF context('select wrong subtree')
		}) // ENDOF context('Keymap Subtrees')
	}) // ENDOF context('Keymaps')



}) // ENDOF describe('OPTIONS')


describe('MAPPING', ()=> {
	context('* map one key to another', ()=> {
		it('should map \'foo\' to \'bar\'', function(done) {
			let keymapping 	= new KeyMapping({
				'foo': 'myKey'
			})
			,	dataMapped 	= keymapping.map(testData)

			assert.equal(dataMapped.myKey, 'foo_content')

			done()
		})
	})
}) // ENDOF describe('OPTIONS')

