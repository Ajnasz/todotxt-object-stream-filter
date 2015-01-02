'use strict';
var assert = require('assert');

var TodotxtObjectStream = require('todotxt-object-stream');

var TodotxtObjectStreamFilter = require('../index');

describe('Test if pipes all past events', function () {
	var todotxtObjectStream;
	var todotxtObjectStreamFilter;

	beforeEach(function () {
		todotxtObjectStream = new TodotxtObjectStream();
		todotxtObjectStreamFilter = new TodotxtObjectStreamFilter({
			past: true
		}, new Date('2014-11-20'));
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
		todotxtObjectStreamFilter.on('data', function (/* d */) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-11-11');
	});

	it('should disable future events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-11-22');
	});
});

describe('Test if pipes same day events', function () {
	var todotxtObjectStream;
	var todotxtObjectStreamFilter;

	beforeEach(function () {
		todotxtObjectStream = new TodotxtObjectStream();
		todotxtObjectStreamFilter = new TodotxtObjectStreamFilter({
			sameDay: true
		}, new Date('2014-11-20'));
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

	it('should enable same day events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (/* d */) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-11-20');
	});

	it('should disable future day events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-11-21');
	});
	it('should disable past day events', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-11-19');
	});
});

describe('Test if pipes all events on the week', function () {
	var todotxtObjectStream;
	var todotxtObjectStreamFilter;

	beforeEach(function () {
		todotxtObjectStream = new TodotxtObjectStream();
		todotxtObjectStreamFilter = new TodotxtObjectStreamFilter({
			sameWeek: true,
		}, new Date('2014-11-20'));
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
	it('should enable events on the same week (earlier days)', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (/* d */) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test2 due:2014-11-18');
	});
	it('should enable events on the same week (next days)', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (/*d*/) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});
		todotxtObjectStream.end('Test3 due:2014-11-22');
	});
	it('should disable events on the pervious week', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (d) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});
		todotxtObjectStream.end('Test3 due:2014-11-16');
	});
	it('should disable events on the next week', function (done) {
		var found = false;
		todotxtObjectStreamFilter.on('data', function (/*d*/) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});
		todotxtObjectStream.end('Test3 due:2014-11-24');
	});
});
describe('Test if pipes all dates follwing by x days', function () {
	var todotxtObjectStream;
	var todotxtObjectStreamFilter;

	beforeEach(function () {
		todotxtObjectStream = new TodotxtObjectStream();
		todotxtObjectStreamFilter = new TodotxtObjectStreamFilter({
			following: 12
		}, new Date('2014-11-20'));
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

	it('should enable next 12 days', function (done) {
		var found = false;

		todotxtObjectStreamFilter.on('data', function (/* d */) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-12-02');
	});
	it('should disable days after next 12', function (done) {
		var found = false;

		todotxtObjectStreamFilter.on('data', function (/* d */) {
			found = true;
		});
		todotxtObjectStream.once('end', function () {
			assert(!found);
			done();
		});

		todotxtObjectStream.end('Test1 due:2014-12-03');
	});
});
