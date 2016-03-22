import assert						from 'assert'
// import KeyMapping					from '../src/TailoredKeymapping.class.js'
import KeyMapping					from '../dist/TailoredKeymapping.class.js'

// keymaps used in tests
import keymapSubtrees				from './keymaps/keymapSubtrees'
import keymapBasic					from './keymaps/keymapBasic'
import keymapBasicWithoutSubtree 	from './keymaps/keymapBasicWithoutSubtree'

// const keymapping = new KeyMapping(keymapBasic)
var testData = {
	foo: 'foo_content'
,	bar: 'bar_content'
}

describe('OPTIONS', ()=> {

	context('Keymap', ()=> {

		context('* change Keymap after initialisation', ()=> {
			it('should process with new map', function(done) {
				var keymapping 	= new KeyMapping({'nothing': 'nada'})
				// change keymap
				keymapping.setKeymap(keymapBasic)
				// process afterwards
				var	dataMapped 	= keymapping.map(testData, {
						'keymapTree': 'test'
					})
				,	result 		= keymapping.getKeymapSubtree()
				// picked the right keymap subtree?
				assert.equal(result.foo, 'bar')
				done()
			})
		})

		context('Subtrees', ()=> {
			context('* select subtree per string', ()=> {
				it('should pick the right subtree', function(done) {
					var keymapping 	= new KeyMapping(keymapSubtrees)
					,	dataMapped 	= keymapping.map(testData, {
							'keymapTree': 'test'
						})
					,	result 		= keymapping.getKeymapSubtree()
					// picked the right keymap subtree?
					assert.equal(result.subtree.foo, 'bar')
					done()
				})
			})
			context('* select subtree per array', ()=> {
				it('should pick the right subtree', function(done) {
					var keymapping 	= new KeyMapping(keymapSubtrees)
					,	dataMapped 	= keymapping.map(testData, {
							'keymapTree': ['test', 'subtree']
						})
					,	result 		= keymapping.getKeymapSubtree()
					// picked the right keymap subtree?
					assert.equal(result.foo, 'bar')
					done()
				})
			})
			context('* select wrong subtree', ()=> {
				var keymapping 	= new KeyMapping(keymapBasic)
				,	dataMapped

				context('* per string \'mykey\'', ()=> {
					it('should throw [Error: [TailoredKeymapping] \'keymap.mykey\' not found or invalid]', function(done) {

						// subtree per string
						try {
							dataMapped 	= keymapping.map(testData, {
								'keymapTree': 'mykey'
							})
						}
						catch(err) {
							assert.equal(err.message.indexOf('\'keymap.mykey\' not found or invalid') !== -1, true)
						}

						done()
					})
				})
				context('* per array [\'test\', \'foo\', \'mykey\']', ()=> {
					it('should throw [Error: [TailoredKeymapping] \'keymap.test.foo\' not found or invalid]', function(done) {
						var keymapping 	= new KeyMapping(keymapBasic)
						,	dataMapped

						try {
							dataMapped 	= keymapping.map(testData, {
								'keymapTree': ['test', 'foo', 'mykey']
							})
						}
						catch(err) {
							// keymap.test.FOO is invalid (no object) so 'mykey' gets ignored
							assert.equal(err.message.indexOf('\'keymap.test.foo\' not found or invalid') !== -1, true)
						}

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
			var keymapping 	= new KeyMapping({
				'foo': 'myKey'
			})
			,	dataMapped 	= keymapping.map(testData)

			assert.equal(dataMapped.myKey, 'foo_content')

			done()
		})
	})
}) // ENDOF describe('OPTIONS')

