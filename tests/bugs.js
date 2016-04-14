import assert						from 'assert'
import KeyMapping					from '../src/TailoredKeymapping.class.js'

// global instance with 'fake'-keymap
const _keymapping = new KeyMapping({nothing: null})

let testData = {
	foo: 'foo_content'
,	bar: 'bar_content'
}

// FIXXED
// context('MAPPING', ()=> {
// 	context('mappedKey > originalKey', ()=> {
// 		it('BAR should be foo_content', function(done) {
// 			// => if (key is defined + onlyMappedVars: false) take mappedData
// 			var data 		= {
// 					'foo': 'foo_content'
// 				,	'bar': 'bar_content'
// 				}
// 			,	keymapping 	= new KeyMapping({
// 					'test': {
// 						'foo': 	'bar'
// 					,	'abc': 	'xyz'
// 					}
// 				})
// 			,	dataNew = keymapping.map(data, {
// 				'keymapTree': ['test']
// 			,	onlyMappedVars: false
// 			})

// 			assert.equal(dataNew.bar, 'foo_content')

// 			done()
// 		})
// 	})
// })

// FIXXED
// context('MAPPING', ()=> {
// 	context('Subtrees', ()=> {
// 		console.log('getKEymap outer', _keymapping.getKeymap())

// 		// BROKEN THIS CONTEXT
// 		// _keymapping.setKeymap({'TESTESTEST': 'test'}) // NOT ! WORKING

// 		context('* select subtree per string', ()=> {
// 			it('should pick the right subtree', (done) => {
// 				// BROKEN THIS CONTEXT
// 				_keymapping.setKeymap({'test': {foo: 'bar'}}) // WORKING !
// 				let testData 	= {foo: 'foo_content'}
// 				,	dataMapped 	= _keymapping.map(testData, {
// 						'keymapTree': 'test'
// 					})
// 				,	result 		= _keymapping.getKeymapSubtree()
// 				console.log('getKEymap inner', result)
// 				// picked the right keymap subtree?
// 				assert.equal(result.foo, 'bar')
// 				done()
// 			})
// 		})
// 	})
// })
