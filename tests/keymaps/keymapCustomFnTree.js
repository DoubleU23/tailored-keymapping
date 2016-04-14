export const keymapCustomFnCallback 	= function(data, originalData) {
	data.callbackGenerated = originalData.abc + '-' + data.newKeyValue
	return data
}
const keymapCustonFnTree 		= {
	'test': {
		// translate server to client
		'client': {
			abc: 					'newKey'
		,	'bar': 					(data, originalData) => data.foo
		,	'returnValue': 			(data, originalData) => data.abc + '-' + data.foo
		,	'returnValueMapped': 	(data, originalData) => data.newKey + '-' + data.abc
		,	'returnKeyValue': 		(data, originalData) => ['newKeyValue', data.foo + '-' + data.bar]
		,	'test':  				(data, originalData) => data.returnKeyValue
		}
	}
}
export default keymapCustonFnTree
