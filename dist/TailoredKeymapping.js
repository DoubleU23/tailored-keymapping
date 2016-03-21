'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TailoredKeyMapping = function () {
	function TailoredKeyMapping(keyMap) {
		var _this = this;

		_classCallCheck(this, TailoredKeyMapping);

		this.map = function (data, type, options) {
			// last argument = options || callback
			_this.validateKeyMap();

			// set up vars
			var _options = _lodash2.default.assign({},
			// merge default options ...
			{ mappingType: 'client', onlyMappedVars: false, callback: null },
			// ... with given options || callbackFn
			typeof options === 'function' ? { 'callback': options } : options),
			    dataNew = {},

			// flat or deep map - use mappingType or not
			map = _typeof(_this.keyMap[0]) === 'object' ? _this.keyMap[type][_options.mappingType] : _this.keyMap[type],
			    size = _lodash2.default.size(data),
			    customFns = {},
			    counter = 0,
			    r = void 0;

			// process mapping
			_lodash2.default.each(data, function (v, i) {
				counter++;

				if (map[i]) {
					// check for newKey
					if (typeof map[i] !== 'function')
						// use given key
						dataNew[map[i]] = v;else
						// add to customFns
						customFns[i] = map[i];
				} else // key not found - take old key
					if (!_options.onlyMappedVars) dataNew[i] = v;

				// LAST STEP
				if (counter >= size) {
					if (Object.keys(customFns).length) {
						_lodash2.default.each(customFns, function (v, i) {
							r = v.apply(_this, [dataNew]);
							if ((typeof r === 'undefined' ? 'undefined' : _typeof(r)) === 'object')
								//	return is a "array" - [key, object]
								dataNew[r[0]] = r[1];else
								// 	return should be a value -> use old key
								dataNew[i] = r;
						});
					}
					// callback
					if (typeof _options.callback === 'function') _options.callback.apply(_this, [dataNew]);
				}
			});
			return dataNew;
		};

		// could be undefined... validateKeyMap called in this.map
		this.keyMap = keyMap;
	}

	_createClass(TailoredKeyMapping, [{
		key: 'validateKeyMap',
		value: function validateKeyMap(keyMap) {
			var _keyMap = keyMap || this.keyMap;
			if (!_keyMap) this.error('no keyMap defined. You can use \'instance.setMap(keyMap)\' set a map after initialisation');else if ((typeof _keyMap === 'undefined' ? 'undefined' : _typeof(_keyMap)) !== 'object') this.error('invalid typeof keyMap. \'object\' required!');
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

	}], [{
		key: 'error',
		value: function error(msg) {
			throw new Error('[TailoredKeyMapping] ' + msg);
		}
	}, {
		key: 'setMap',
		value: function setMap(keyMap) {
			this.validateKeyMap(keyMap);
			this.keyMap = keyMap;
		}
	}]);

	return TailoredKeyMapping;
}();

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


exports.default = TailoredKeyMapping;

//# sourceMappingURL=TailoredKeymapping.js.map