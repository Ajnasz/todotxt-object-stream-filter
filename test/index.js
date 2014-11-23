var assert = require('assert');

var TodotxtObjectStream = require('todotxt-object-stream');

var TodotxtObjectStreamFilter = require('../index');

describe('Test if pipes all events which are needed', function () {
	var todotxtObjectStream;
	var todotxtObjectStreamFilter;

	beforeEach(function () {
		todotxtObjectStream = new TodotxtObjectStream();
		todotxtObjectStreamFilter = new TodotxtObjectStreamFilter(['past', 'weekly', 'sameWeek'], new Date('2014-11-20'));
		todotxtObjectStreamFilter.on('error', function (er) {
			console.error(er);
			process.exit(1);
		});
		todotxtObjectStream.pipe(todotxtObjectStreamFilter);
	});
	afterEach(function () {
		todotxtObjectStream.unpipe();
		todotxtObjectStreamFilter.unpipe();
		todotxtObjectStream = null;
		todotxtObjectStreamFilter = null;
	});

	it('should enable past events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2013-11-11');
	});
	it('should enable weekly events', function (done) {
		var found = false;;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test2 due:2014-11-20');
	});
	it('should enable same week events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});
		todotxtObjectStream.end('Test3 due:2014-11-22');
	});
});
