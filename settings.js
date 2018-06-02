"use strict";

const Throttle = require('superagent-throttle');

module.exports = {
	ttUrl: 'https://www.tele-task.de',
	savePath: './output',
	skipExisting: true,
	throttle: new Throttle({
		active: true, // set false to pause queue
		rate: 1, // how many requests can be sent every `ratePer`
		ratePer: 500, // number of ms in which `rate` requests may be sent
		concurrent: 1 // how many requests can be sent concurrently
	})
};