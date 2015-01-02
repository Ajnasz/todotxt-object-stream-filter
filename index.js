'use strict';
var Transform = require('stream').Transform;
var util = require('util');
// var debug = require('debug')('todo-filter-stream');
var lodash = require('lodash');
var moment = require('moment');

var filters = {
    isDateOnWeekWithOtherDate: function (date, matcher) {
        var dateClone = moment(date),
            matcherClone = moment(matcher);

		dateClone.endOf('week').startOf('day');
		matcherClone.endOf('week').startOf('day');

        return dateClone.unix() === matcherClone.unix();
    },

    isDateOnSameDayWithOtherDate: function (date, matcher) {
        var dateClone = moment(date),
            matcherClone = moment(matcher);

		dateClone.startOf('day');
		matcherClone.startOf('day');

        return dateClone.unix() === matcherClone.unix();
    },

    isPastDate: function (date, matcher) {
        var dateClone = moment(date),
            matcherClone = moment(matcher);

		dateClone.startOf('day');
		matcherClone.startOf('day');

        return dateClone.unix() < matcherClone.unix();
    },

	isDateFollowsOtherDate: function (date, matcher, days) {
        var dateClone = moment(date),
            matcherClone = moment(matcher);

		dateClone.startOf('day');
		matcherClone.startOf('day');

		return (dateClone.unix() - matcherClone.unix()) / (60 * 60 * 24) <= days;
	}
};

/**
 * @method mustShow
 * @private
 * @param {Date} day Reference date object
 * @param {Object} task A task object
 * {
 *   text: 'foo',
 *   due: '2011-11-11',
 *   treshold: '2011-11-11'
 * }
 * @param {Array} filterProps List of filter methods: ['past', 'sameDay'] Any
 * of them returns true, the function will return true
 * @return Boolean True, if the task should be shown in a email becuase it's due or overdue
 */
function mustShow(day, task, filterProps) {
	var filterMap, taskDate;

	filterMap = {
		past: filters.isPastDate,
		sameDay: filters.isDateOnSameDayWithOtherDate,
		sameWeek: filters.isDateOnWeekWithOtherDate,
		following: filters.isDateFollowsOtherDate
	};

	taskDate = task.due || task.treshold || null;

	if (taskDate) {
		return lodash(filterMap)
			.pick(lodash.keys(filterProps))
			.some(function (filterFun, name) {
			return filterFun(taskDate, day, filterProps[name]);
		});
	}

	return false;
}

function TodotxtObjectStreamFilter(filterProps, refDate) {
	this.filterProps = filterProps;
	this.refDate = refDate || new Date();
	Transform.call(this, {objectMode: true});
}

util.inherits(TodotxtObjectStreamFilter, Transform);

TodotxtObjectStreamFilter.prototype._transform = function (data, enc, cb) {
	if (mustShow(this.refDate, data, this.filterProps)) {
		this.push(data);
	}
	cb();
};

module.exports = TodotxtObjectStreamFilter;
