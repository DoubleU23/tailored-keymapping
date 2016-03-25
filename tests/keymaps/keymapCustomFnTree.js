const keyMap = {
	'test': {
		// translate server to client
		'client': {
			// to prevent 'foo'-key we use a customFn here
			// tbd: if key 2map2 is set in originalData => use fn like that !?
			'bar': 				(data)=>data.foo
		,	'returnValue': 		(data) =>
				data.abc + '-' + data.bar
		,	'returnKeyValue': 	(data) =>
				['newKeyValue', data.foo + '-' + data.bar]
		}
	}
}
export default keyMap
