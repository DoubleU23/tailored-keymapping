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

/**
 * Tailoredkeymapping
 * 	maps objectKeys per given key2keyPairs
 */

var Tailoredkeymapping = function () {
	_createClass(Tailoredkeymapping, [{
		key: 'error',
		value: function error(msg) {
			throw new Error('[TailoredKeymapping] ' + msg);
		}
	}]);

	function Tailoredkeymapping(keymap) {
		_classCallCheck(this, Tailoredkeymapping);

		this.keymap = keymap;
	}

	_createClass(Tailoredkeymapping, [{
		key: 'getKeymap',
		value: function getKeymap() {
			return this.keymap;
		}
	}, {
		key: 'setKeymap',
		value: function setKeymap(keymap) {
			if ((typeof keymap === 'undefined' ? 'undefined' : _typeof(keymap)) !== 'object') this.error('invalid typeof keymap. \'object\' required!');
			this.keymap = keymap;
		}
	}, {
		key: 'validateKeymap',
		value: function validateKeymap() {
			if (!this.keymap) this.error('no keymap defined. You can use \'setkeymap(keymap)\' set a map after initialisation');else if (_typeof(this.keymap) !== 'object') this.error('invalid typeof keymap. \'object\' required!');
		}
	}, {
		key: 'getKeymapTree',
		value: function getKeymapTree(tree) {
			var _this = this;

			var keymapSubtree;
			if (!tree) {
				keymapSubtree = this.keymap;
			} else if (typeof tree === 'string') {
				if (!!this.keymap[tree] && _typeof(this.keymap[tree]) === 'object') {
					keymapSubtree = this.keymap[tree];
				} else this.error('\'keymap.' + tree + '\' not found or invalid');
			} else if (tree instanceof Array) {
				var mapInner = tree.reduce(function (map, subtree, i) {
					if (!!map[subtree] && _typeof(map[subtree]) === 'object') {
						return map[subtree];
					} else {
						var notFound = tree.slice(0, i + 1).join('.');
						_this.error('\'keymap.' + notFound + '\' not found or invalid');
					}
				}, this.keymap);
				keymapSubtree = mapInner;
			} else {
				this.error('can\'t handle keymapTree of type object');
			}

			this.setKeymapSubtree(keymapSubtree);
			return keymapSubtree;
		}
	}, {
		key: 'setKeymapSubtree',
		value: function setKeymapSubtree(subtree) {
			this.keymapSubtree = subtree;
		}
	}, {
		key: 'getKeymapSubtree',
		value: function getKeymapSubtree() {
			return this.keymapSubtree;
		}
	}, {
		key: 'setOptions',
		value: function setOptions(options) {
			this.options = _lodash2.default.assign({},
			// merge default options ...
			{ onlyMappedVars: false, callback: '', keymapTree: '' },
			// ... with given options || callbackFn
			typeof options === 'function' ? { 'callback': options } : options);
			return this.options;
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

	}, {
		key: 'map',
		value: function map(data, options) {
			var _this2 = this;

			// last argument = options || callback

			// keymap || error
			this.validateKeymap();

			// set up vars
			var _options = this.setOptions(options),
			    dataNew = {}
			// tbd: check whole keymap(+subtree) on construct
			,
			    map = this.getKeymapTree(_options.keymapTree),
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
							r = v.apply(_this2, [dataNew]);
							if ((typeof r === 'undefined' ? 'undefined' : _typeof(r)) === 'object')
								//	return is a "array" - [key, object]
								dataNew[r[0]] = r[1];else
								// 	return should be a value -> use old key
								dataNew[i] = r;
						});
					}
					// callback
					if (typeof _options.callback === 'function') _options.callback.apply(_this2, [dataNew]);
				}
			});
			return dataNew;
		}
	}]);

	return Tailoredkeymapping;
}();

exports.default = Tailoredkeymapping;

//# sourceMappingURL=TailoredKeymapping.class.js.map