const keyMap = {
	'test': {
		// translate server to client
		'client': {
			abc: 					'newKey'
			// to prevent 'foo'-key we use a customFn here
			// tbd: if key 2map2 is set in originalData => use fn like that !?
		,	'bar': 					(data, originalData) => data.foo
		,	'returnValue': 			(data, originalData) =>
				data.abc + '-' + data.foo
		,	'returnValueMapped': 	(data, originalData) =>
				data.newKey + '-' + data.abc
		,	'returnKeyValue': 		(data, originalData) =>{
				return ['newKeyValue', data.foo + '-' + data.bar]
			}
		,	'test':  				(data, originalData)=>data.returnKeyValue
		}
	}
}
export default keyMap
