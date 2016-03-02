import _ from 'lodash';

export default class TailoredKeyMapping {

	constructor(keyMap) {
		// could be undefined... validateKeyMap called in this.map
		this.keyMap = keyMap;
	}

	static error(msg) {
		throw new Error('[TailoredKeyMapping] ' + msg);
	}

	static setMap(keyMap) {
		this.validateKeyMap(keyMap);
		this.keyMap = keyMap;
	}

	validateKeyMap(keyMap) {
		const _keyMap = keyMap || this.keyMap;
		if (!_keyMap)
			this.error('no keyMap defined. You can use \'instance.setMap(keyMap)\' set a map after initialisation');
		else
			if (typeof _keyMap !== 'object')
				this.error('invalid typeof keyMap. \'object\' required!');
		return true;
	}

	/**
	 * MapKeys
	 * 	maps objectKeys per given key2keyPairs
	 *
	 * @param  {(flat) object} data - given data keyValueMap
	 * @param  {string} type - the subtree of the keyMap to use
	 * @param  {object | function} options|callback
	 *                   @option {string} 	mappingType 		- the subsubtree of the keyMap to use - default: 'client'
	 *                   @option {bool} 	onlyMappedVars 	- pass unmapped keys? - default: true
	 *                   @option {funciton} callback 			- function to be called after mapping - called with mapped data
	 * @return {object} mapped KeyValue pairs
	 *
	 * usage (after initiation):
	 * 	let mappedData = keyMapping.map(payload['FLAT_STRUCT'], 'user', {
	 *		'mappingType': 'client'|'server',
	 *		'onlyMappedVars': true|false, // pass unmapped keys?
	 *		callback: (data)=>{return newData}
	 *	});
	 * OR
	 * 	let mappedData = keyMapping.map(payload['FLAT_STRUCT'], 'user', (data)=>{
	 *		// callback function
	 *		// mutate data here after mapping completed
	 *	});
	 */
	map = (data, type, options) => { // last argument = options || callback
		this.validateKeyMap();

		// set up vars
		let 	_options 		= _.assign({},
								// merge default options ...
								{mappingType: 'client', onlyMappedVars: false, callback: null},
								// ... with given options || callbackFn
								typeof options === 'function' ? {'callback' : options} : options
			),
			dataNew 		= {},
			// flat or deep map - use mappingType or not
			map 			= typeof this.keyMap[0] === 'object' ? this.keyMap[type][_options.mappingType] : this.keyMap[type],
			size 			= _.size(data),
			customFns 		= {},
			counter 		= 0,
			r;

		// process mapping
		_.each(data, (v, i)=>{
			counter++;

			if (map[i]) { // check for newKey
				if (typeof map[i] !== 'function')
					// use given key
					dataNew[map[i]] = v;
				else
					// add to customFns
					customFns[i] = map[i];
			}
			else // key not found - take old key
				if (!_options.onlyMappedVars) dataNew[i] = v;

			// LAST STEP
			if (counter >= size) {
				if (Object.keys(customFns).length) {
					_.each(customFns, (v, i)=>{
						r = v.apply(this, [dataNew]);
						if (typeof r === 'object')
						//	return is a "array" - [key, object]
							dataNew[r[0]] = r[1];
						else
						// 	return should be a value -> use old key
							dataNew[i] = r;
					});
				}
				// callback
				if (typeof _options.callback === 'function')
					_options.callback.apply(this, [dataNew]);
			}
		});
		return dataNew;
	};

}



// atm unused
// export const getMapArgs = (data, map, onlyMappedVars = false) => {
// 	console.log('calling getMapArgs', data, map, onlyMappedVars);
// 	return [
// 		data,
// 		(v, i) => {
// 			console.log('mapKeys', v, i);
// 			if (!onlyMappedVars) data[i] = v;
// 			if (!!map[i]) data[map[i]] = v;
// 			console.log('[getMapArgs] return ', data);
// 			return data;
// 		}
// 	];
// };

// // TBD
// // use for NESTED objects
// const mapDeep = (data, type, translateFor) =>
// 	_.map.apply(_, getMapArgs(data, keyMap[type][translateFor]));
