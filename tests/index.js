/**
 * bugs:
 * 	broken context
 * 		doesn't set the keymap for underlying contexts...
 * 		i use IIFE to inject context data (see CUSTOM MAPPING FUNCTIONS f.e.)
 * 	assert.throws
 * 		doesn't fail on wrong error msg (third parameter) (see "select wrong subtree")
 */
import assert					from 'assert'
import KeyMapping				from '../src/TailoredKeymapping.class'
// import KeyMapping				from '../dist/TailoredKeymapping.class'

// keymaps used in tests
import keymapBasicFlat			from './keymaps/keymapBasicFlat'
import keymapBasicTree			from './keymaps/keymapBasicTree'
import keymapBasicSubTree		from './keymaps/keymapBasicSubTree'
import keymapCustomFnTree
,	{keymapCustomFnCallback}	from './keymaps/keymapCustomFnTree'
// testData
import dataBasicFlat			from './data/dataBasicFlat'
import dataCustomFnTree			from './data/dataCustomFnTree'

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
				dataMapped 	= _keymapping.map(dataBasicFlat)
				result 		= _keymapping.getKeymapSubtree()
				// check keymap subtree
				assert.equal(result.foo, 'bar')
				done()
			})
		})
		context('Subtrees', ()=> {
			// _keymapping.setKeymap(keymapBasicSubTree)
			context('* select subtree per string', ()=> {
				it('should pick the right subtree', (done) => {
					_keymapping.setKeymap(keymapBasicSubTree)
					dataMapped 	= _keymapping.map(dataBasicFlat, {
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
					_keymapping.setKeymap(keymapBasicSubTree)
					dataMapped 	= _keymapping.map(dataBasicFlat, {
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
						// 	dataMapped 	= _keymapping.map(dataBasicFlat, {
						// 		'keymapTree': 'mykey'
						// 	})
						// }, Error, '\'keymap.mykey\' not found or invalid')

						let _err = {message: ''}
						try {
							_keymapping.setKeymap(keymapBasicTree)
							dataMapped 	= _keymapping.map(dataBasicFlat, {
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
							_keymapping.setKeymap(keymapBasicTree)
							dataMapped 	= _keymapping.map(dataBasicFlat, {
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
		it('should map \'foo\' to \'myKey\'', function(done) {
			_keymapping.setKeymap({'foo': 'myKey'})
			dataMapped 	= _keymapping.map(dataBasicFlat)

			assert.equal(dataMapped.myKey, 'foo_content')
			done()
		})
	})

	/**
	 * CUSTOM MAPPING FUNCTIONS
	 * 	inject context data (DRY) per IIFE
	 */
	_keymapping.setKeymap(keymapCustomFnTree)
	dataMapped = _keymapping.map(dataCustomFnTree, {keymapTree: ['test', 'client']})
	context('* custom mapping functions (with access to mappedData object)', ((dataMapped) =>
		(()=>{ // FN returned by IIFE
			context('* return new value', ()=>{
				it('should assign \'foo\'s content to \'bar\' key', function(done) {
					assert.equal(dataMapped.bar, 'foo_content')
					done()
				})
			})
			context('* return new valueKey-pair', ( )=> {
				it('should map \'abc\'+\'-\'+\'bar\' to \'returnValue\' key', function(done) {
					assert.equal(dataMapped.returnValue, 'xyz-foo_content')
					done()
				})
			})
			context('* return new value (depends on mapped key)', () => {
				it('should assign \'newKey\'+\'-\'+\'abc\' to \'returnValueMapped\'', function(done) {
					assert.equal(dataMapped.returnValueMapped, 'xyz-xyz')
					done()
				})
			})

		})
	)(dataMapped))

	/**
	 * CALLBACK FUNCTION
	 */
	// keymap already set to 'keymapCustomFnTree'
	dataMapped = _keymapping.map(dataCustomFnTree, {
		keymapTree: ['test', 'client']
	,	callback: keymapCustomFnCallback
	})
	context('* callback function', ((dataMapped)=>
		(()=>{ // FN returned by IIFE
			context('* return new value which depends on other key', () => {
				it('should assign \'foo\'s content to \'bar\' key', function(done) {
					assert.equal(dataMapped.callbackGenerated, 'xyz-foo_content-foo_content')
					done()
				})
			})
		})
	)(dataMapped))

}) // ENDOF describe('OPTIONS')

