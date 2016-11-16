require('should');

const sum = require('./sum');

describe('sum test', () => {

	it('should sum two nambers', () => {
		sum(-1, 2).should.eql(1);
	});
});