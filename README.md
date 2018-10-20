# tailored-keymapping 
> **map objectKeys with given keyMap**

[![Build Status](https://travis-ci.org/DoubleU23/tailored-keymapping.svg?branch=master)](https://travis-ci.org/DoubleU23/tailored-keymapping)
[![dependencies Status](https://david-dm.org/doubleu23/tailored-keymapping/status.svg)](https://david-dm.org/doubleu23/tailored-keymapping)
[![devDependencies Status](https://david-dm.org/doubleu23/tailored-keymapping/dev-status.svg)](https://david-dm.org/doubleu23/tailored-keymapping?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/npm/tailored-keymapping/badge.svg)](https://snyk.io/test/npm/tailored-keymapping) [![Greenkeeper badge](https://badges.greenkeeper.io/DoubleU23/tailored-keymapping.svg)](https://greenkeeper.io/)

## Usage
    npm install tailored-keymapping --save

```JavaScript
import TailoredKeymapping from 'tailored-keymapping'

// define keymap
const keymap = {
    'test': {
        'oldKey':   'newKey'
    ,   'foo':      'bar'
    ,   'abc':      'xyz'
        /**
         * custom mapping function
         *  called after mapping loop
         * @param  {object} data - mapped data object
         * @return {any} newValue - new value of the keyName
         * @return {array} [newKey,newValue] - new key/value pair
         */
    ,   'keyName': function(data) {
            return ['newKey', newValue]
            // return newValue; // to use original keyname ('keyName')
        }
    }
}

// create instance
const keyMapping = new TailoredKeymapping(keymap)

// overwrite keymap after initialisation if needed
keyMapping.setKeymap(otherKeymap)

// process data with given options
let mappedData = keyMapping.map(dataToMap, {
       'keymapTree':        'test' // || ['sub', 'subsub']
    ,  'onlyMappedVars':    true
        /**
         * callback function
         *  mutate data after mapping
         * @param  {object} dataMapped   - mapped data object (after custom functions)
         * @param  {object} dataOriginal - mapped data object (after custom functions)
         * @return {object} newData - mutated data object
         */
    ,   callback: function(data) {
            data.dynamicVar = data.foo + data.abc;
            return data;
        }
     )

// you can also rely on default options and just pass a callback function
mappedData = keyMapping.map(payload, (data)=>newData)
```
### default options
```JavaScript
{
    onlyMappedVars: false   // drop old keys?
,   keymapTree:     ''      // keymaps subtree to use
,   callback:       null    // mutate data after mapping
}
```

## Examples
```JavaScript
import KeyMapping from 'tailored-keymapping'
// create instance with keyMap
const keyMapping = new KeyMapping({foo: 'bar'})

// basic flat keymap
let dataMapped = keyMapping.map({foo: 'foo_content'})
console.log(dataMapped) // => {bar: 'foo_content', foo: 'foo_content'}

// basic deep keymap
keyMapping.setKeymap({sub: {subsub: {foo: 'bar'}}})
dataMapped = keyMapping.map(
    {foo: 'foo_content'}
,   {   keymapTree: ['sub', 'subsub']
    ,   onlyMappedVars: true
    }
)
console.log(dataMapped) // => {bar: 'foo_content'}

// custom functions
keyMapping.setKeymap({
    'newKey': (data) => data.foo+'-'+data.bar
})
dataMapped = keyMapping.map(
    {foo: 'foo', bar: 'bar'} // data2map
,   {onlyMappedVars: true}  // options or callback
)
console.log(datMapped) // => {newKey: 'foo-bar'}

```
> for more examples have a look at the mocha tests

## Roadmap
* 0.2.0     - finish basic tests
* 0.1.6     - remove lodash dependecy (?)
* 0.1.45    - added travis build hook
* 0.1.44    - fixxed bug (mappedKey > originalKey)
* 0.1.41    - added callback tests
* 0.1.4     - added tests
* 0.1.2     - dist folder is new entrypoint

## TBD
* assert.throws doesn't fail on wrong Error msg (@tests: 'select wrong subtree')
* keymap handling in constructor !?

## Bugs
if you find a bug, please report them [@Issues](https://github.com/DoubleU23/tailored-keymapping/issues
)
