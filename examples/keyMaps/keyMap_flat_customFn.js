const keyMap = {
	'products': {
		// translate server to client
		'client': {
			'foo': 				'bar',
			'abc': 				'xyz',
			'anotherKey': 		function(data) {
				const valNew = ''
					+ 'bar=' + data.bar
					+ '__'
					+ 'xyz=' + data.xyz;
				return ['anotherKeyReplacement', valNew];
			}
		}
	}
};
export default keyMap;
