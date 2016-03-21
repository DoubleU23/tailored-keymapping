# tailored-keymapping
map objectKeys with given keyMap

## Usage
```JavaScript
import TailoredKeymapping from 'tailored-keymapping';

// define keymap
const keymap = {
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

// create instance
const keyMapping = new TailoredKeymapping(keymap);

// overwrite keymap after initialisation if needed
// keyMapping.setMap(otherKeymap)

// process data with given options
let  mappedData = keyMapping.map(dataToMap, {
		'keymapTree': 'test', // key for subtree of keymap
		'onlyMappedVars': bool,
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

// you can also rely on default options and just pass a callback function
// let  mappedData = keyMapping.map(payload, (data)=>newData);
```
__options__
```JavaScript
{// defaults
	onlyMappedVars: false, // bool - pass unmapped vars too?
	keymapTree: ['subtree', 'subsubtree'], // string || array
	callback: null // function
},
```

## Roadmap
* add clean minimalistic example to README
* setup npm scripts
* remove lodash as dependecy (?)
* clean package output
	* npm ignore
	* ES5 variant in 'dist' folder
* use structure for tailored-package-boilerplate

## Bugs
* given key overwrites originalkey (depends on keyorder)  
	=> see "npm run bugs" (tests/bugs.js)
