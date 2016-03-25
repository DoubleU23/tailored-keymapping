# tailored-keymapping
map objectKeys with given keyMap

## Examples
```JavaScript
import KeyMapping from 'tailored-keymapping'
const keyMapping = new KeyMapping({foo: 'bar'})

// basic flat keymap
let dataMapped = keyMapping.map({foo: 'foo_content'})
console.log(dataMapped) // => {bar: 'foo_content', foo: 'foo_content'}

// basic deep keymap
keyMapping.setKeymap({sub: {subsub: {foo: 'bar'}}})
dataMapped = keyMapping.map(
    {foo: 'foo_content'}, {
        keymapTree: ['sub', 'subsub']
    ,   onlyMappedVars: true
    }
)
console.log(dataMapped) // => {bar: 'foo_content'}

// custom functions
keyMapping.setKeymap({'newKey': (data)=>data.foo+'-'+data.bar})
dataMapped = keyMapping.map({foo: 'foo', bar: 'bar'}, {onlyMappedVars: true})
console.log(datMapped) // => {newKey: 'foo-bar'}

```

## Usage
```JavaScript
import TailoredKeymapping from 'tailored-keymapping';

// define keymap
const keymap = {
    'test': {
        'oldKey':   'newKey',
        'foo':      'bar',
        'abc':      'xyz'
        /**
         * custom mapping function
         *  called after mapping loop
         * @param  {object} data - mapped data object
         * @return {any} newValue - new value of the keyName
         * @return {array} [newKey,newValue] - new key/value pair
         */
        'keyName': function(data) {
            return ['newKey', newValue];
            // return newValue; // to use original keyname ('keyName')
        }
    }
};

// create instance
const keyMapping = new TailoredKeymapping(keymap);

// overwrite keymap after initialisation if needed
keyMapping.setKeymap(otherKeymap)

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
        callback: function(data) { // no arrowFn to prevent this-context
            data.dynamicVar = data.foo + data.abc;
            return data;
        }
     );

// you can also rely on default options and just pass a callback function
mappedData = keyMapping.map(payload, (data)=>newData);
```
__options__
```JavaScript
{// defaults
    onlyMappedVars: false, // bool - pass unmapped vars too?
    keymapTree: ['subtree', 'subsubtree'], // string || array
    callback: null // function
}
```

## TBD
* until v0.1.5
    * finish tests
    * fix bugs
* until v0.2.0
    * remove lodash as dependecy (?)
* use structure for tailored-package-boilerplate
* fix bugs/issues

## Bugs
* Keys of "empty or false" values are ignored !?
* given key overwrites originalkey (depends on keyorder)  
    => see "npm run bugs" (tests/bugs.js)
* assert.throws doesn't fail on wrong Error msg (@tests: 'select wrong subtree -> per string')

