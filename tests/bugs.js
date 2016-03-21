import assert						from 'assert'
import KeyMapping					from '../src/TailoredKeymapping.class.js'

context('Collisions', ()=> {
	context('mappedKey > originalKey', ()=> {
		it('BAR should be foo_content', function(done) {
			// tbd: collision between mappedKey and originalKey
			// => if (key is defined + onlyMappedVars: false) take mappedData
			var data 		= {
					'foo': 'foo_content'
				,	'bar': 'bar_content'
				}
			,	keymapping 	= new KeyMapping({
					'test': {
						'foo': 	'bar'
					,	'abc': 	'xyz'
					}
				})
			,	dataNew = keymapping.map(data, {
				'keymapTree': ['test']
			,	onlyMappedVars: false
			})

			assert.equal(dataNew.bar, 'foo_content')

			done()
		})
	})
})
