import _ from 'lodash'

/**
 * Tailoredkeymapping
 * 	maps objectKeys per given key2keyPairs
 */
export default class Tailoredkeymapping {

	error(msg) {
		throw new Error('[TailoredKeymapping] ' + msg)
	}

	constructor(keymap) {
		this.keymap = keymap
	}

	getKeymap() {
		return this.keymap
	}

	setKeymap(keymap) {
		this.validateKeymap(keymap) // maybe throw error
		this.keymap = keymap
		return this
	}

	validateKeymap(keymap) {
		let map = keymap || this.keymap
		if (!map)
			this.error('no keymap defined. You can use \'setkeymap(keymap)\' set a map after initialisation')
		else
			if (typeof map !== 'object')
				this.error('invalid typeof keymap. \'object\' required!')
		return true
	}

	getKeymapTree(tree) {
		var keymapSubtree
		if (!tree) {
			keymapSubtree = this.keymap
		}
		else if (typeof tree === 'string') {
			if (!!this.keymap[tree] && typeof this.keymap[tree] === 'object' ) {
				keymapSubtree = this.keymap[tree]
			}
			else
				this.error('\'keymap.' + tree + '\' not found or invalid')
		}
		else if(tree instanceof Array) {
			let mapInner = tree.reduce((map, subtree, i) => {
					if (!!map[subtree] && typeof map[subtree] === 'object' ) {
						return map[subtree]
					}
					else {
						let notFound = tree.slice(0, i + 1).join('.')
						this.error('\'keymap.' + notFound + '\' not found or invalid')
					}
				}, this.keymap)
			keymapSubtree = mapInner
		}
		else {
			// true-value && !Array && !string
			this.error('can\'t handle keymapTree of type object')
		}

		this.setKeymapSubtree(keymapSubtree)
		return keymapSubtree
	}

	setKeymapSubtree(subtree)	{ this.keymapSubtree = subtree 	}
	getKeymapSubtree()			{ return this.keymapSubtree 	}

	setOptions(options) {
		this.options = _.assign({},
			// merge default options ...
			{onlyMappedVars: false, callback: '', keymapTree: ''},
			// ... with given options || callbackFn
			typeof options === 'function' ? {'callback' : options} : options
		)
		return this.options
	}

	/**
	 * MapKeys
	 * 	maps objectKeys per given key2keyPairs
	 *
	 * @param  {object} data - given data keyValueMap
	 * @param  {string} type - the subtree of the keymap to use
	 * @param  {object | function} options|callback
	 *                   @option {string} 	mappingType 	- the subsubtree of the keymap to use - default: 'client'
	 *                   @option {bool} 	onlyMappedVars 	- pass unmapped keys? - default: true
	 *                   @option {function} callback 			- function to be called after mapping - called with mapped data
	 * @return {object} mapped KeyValue pairs
	 *
	 * usage (after initiation):
	 * 	let mappedData = keymapping.map(payload['FLAT_STRUCT'], 'user', {
	 *		'mappingType': 'client'|'server',
	 *		'onlyMappedVars': true|false, // pass unmapped keys?
	 *		callback: (data)=>{return newData}
	 *	});
	 * OR
	 * 	let mappedData = keymapping.map(payload['FLAT_STRUCT'], 'user', (data)=>{
	 *		// callback function
	 *		// mutate data here after mapping completed
	 *	});
	 */
	map(data, options) { // last argument = options || callback
		// keymap || error
		this.validateKeymap()

		// set up vars
		let	_options 		= this.setOptions(options)
		,	dataNew 		= {}
		// tbd: check whole keymap(+subtree) on construct
		,	map 			= this.getKeymapTree(_options.keymapTree)
		,	size 			= _.size(data)
		,	customFns 		= {}
		,	counter 		= 0
		,	r

		// process mapping
		_.each(data, (v, i)=>{
			counter++

			if (map[i]) { // check for newKey
				if (typeof map[i] !== 'function') {
					// use given key
					dataNew[map[i]] = v
					// also pass the old key if
					if (!_options.onlyMappedVars)
						dataNew[i] = v
				}
				else
					// add to customFns
					customFns[i] = map[i]
			}
			else // key not found - take old key
				if (!_options.onlyMappedVars) dataNew[i] = v

			// LAST STEP
			if (counter >= size) {
				if (Object.keys(customFns).length) {
					_.each(customFns, (v, i)=> {
						r = v.apply(this, [dataNew, data])
						if (typeof r === 'object') {
						//	return is a "array" - [key, object]
							dataNew[r[0]] = r[1]
							if ( !_options.onlyMappedVars && r[0] !== i)
								dataNew[i] = r[1]
						}
						else
						// 	return should be a value -> use old key
							dataNew[i] = r
					})
				}
				// console.log(_options)
				// callback
				if (typeof _options.callback === 'function')
					_options.callback.apply(this, [dataNew, data])
			}
		})
		return dataNew
	};

}
