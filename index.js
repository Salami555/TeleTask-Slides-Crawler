"use strict";

const FS = require('fs');

const querySeries = require('./query-series.js');
const fetchSlides = require('./fetch-slides.js');
const {savePath} = require('./settings.js');

const argv = JSON.parse(process.env.npm_config_argv)['remain'];

if (!FS.existsSync(savePath)) FS.mkdirSync(savePath);

if (argv.length < 1) throw new Error('requires command');
switch (argv[0]) {
    case 'fetch-series':
    case 'fetchSeries':
        if (argv.length < 2) throw new Error('requires series-id');
        querySeries(parseInt(argv[1]), true);
        break;
    case 'fetchVideoSlides':
    case 'fetch-video-slides':
        if (argv.length < 2) throw new Error('requires video-id');
        fetchSlides(parseInt(argv[1]));
        break;
    default:
        throw new Error(`unknown argument "${argv[0]}"`);
}
