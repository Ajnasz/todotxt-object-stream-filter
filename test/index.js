var assert = require('assert');

var TodotxtObjectStream = require('todotxt-object-stream');

var TodotxtObjectStreamFilter = require('../index');

var todotxtObjectStream = new TodotxtObjectStream();
var todotxtObjectStreamFilter = new TodotxtObjectStreamFilter(['past', 'sameDay', 'sameWeek'], new Date('2014-11-20'));

todotxtObjectStream.pipe(todotxtObjectStreamFilter);

var found = {};
todotxtObjectStreamFilter.on('data', function (d) {
	if (/Test1/.test(d.text)) {
		found.past = true;
	}
	if (/Test2/.test(d.text)) {
		found.today = true;
	}
	if (/Test3/.test(d.text)) {
		found.sameWeek = true;
	}
});
todotxtObjectStreamFilter.on('error', function (er) {
	console.error(er);
	process.exit(1);
});

todotxtObjectStream.write('Test1 due:2013-11-11');
todotxtObjectStream.write('Test2 due:2014-11-20');
todotxtObjectStream.write('Test3 due:2014-11-22');

setTimeout(function () {
	if (!found.past) {
		throw new Error('No past item allowed');
	}
	if (!found.today) {
		throw new Error('No today item allowed');
	}
	if (!found.sameWeek) {
		throw new Error('No sameWeek item allowed');
	}
}, 10);
