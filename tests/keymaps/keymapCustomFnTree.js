export const keymapCustomFnCallback 	= function(data, originalData) {
	console.log('[CALLBACK] data', data)
	data.callbackGenerated = originalData.abc + '-' + data.newKeyValue
	return data
}
const keymapCustonFnTree 		= {
	'test': {
		// translate server to client
		'client': {
			abc: 					'newKey'
			// to prevent 'foo'-key we use a customFn here
			// tbd: if key 2map2 is set in originalData => use fn like that !?
		,	'bar': 					(data, originalData) => data.foo
		,	'returnValue': 			(data, originalData) => data.abc + '-' + data.foo
		,	'returnValueMapped': 	(data, originalData) => data.newKey + '-' + data.abc
		,	'returnKeyValue': 		(data, originalData) => ['newKeyValue', data.foo + '-' + data.bar]
		,	'test':  				(data, originalData) => data.returnKeyValue
		}
	}
}
export default keymapCustonFnTree
