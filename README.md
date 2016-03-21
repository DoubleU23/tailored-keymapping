# tailored-keymapping
map objectKeys with given keyMap

## Usage
```JavaScript
import TailoredKeymapping from 'tailored-keymapping'; // not ready yet

const keyMap = {
	'test': {
		'oldKey': 	'newKey',
		'foo': 		'bar',
		'abc': 		'xyz'
		/**
		 * custom mapping function
		 *  called after mapping loop
		 * @param  {object} data - mapped data object
		 * @return {any} newValue - new value of the keyName
		 * @return {array} [newKey,newValue] - new key/value pair
		 */
		'keyName': function(data) { // no arrow-function to preserve this context
			return ['newKey', newValue];
		}
	}
};
const keyMapping = new TailoredKeymapping(keyMap);

let  mappedData = keyMapping.map(payload, 'subtree', {
		'mappingType': 'subsubtree', // ignored for 'flat' keyMaps
		'onlyMappedVars': bool, // pass unmapped keys?
		/**
		 * callback function
		 *  mutate data afterwards
		 * @param  {object} data - mapped data object (after custom functions)
		 * @return {object} newData - mutated data object
		 */
		callback: (data) => {
			data.dynamicVar = data.foo + data.abc;
			return data;
		}
	 );
// you can also ignore options and just pass a callback function
let  mappedData = keyMapping.map(payload, 'subtree', (data)=>newData);
```
__options__
```JavaScript
{// defaults
	mappingType: 'client',
	onlyMappedVars: false,
	callback: null
},
```

## Roadmap
* setup npm scripts
* remove lodash as dependecy (?)
* clean package output
	* npm ignore
	* ES5 variant in 'dist' folder
* use structure for tailored-package-boilerplate

## Bugs
* given key overwrites originalkey (depends on keyorder)  
	=> see "npm run bugs" (tests/bugs.js)
