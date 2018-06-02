"use strict";

const Superagent = require('superagent');

const fetchSlides = require('./fetch-slides.js');
const {ttUrl, throttle} = require('./settings.js');

module.exports = (seriesId, fetch = false) => {
    const sUrl = `${ttUrl}/series/${seriesId}/`;
    console.log(`Querying "${sUrl}"`);
    Superagent.get(sUrl)
        .use(throttle.plugin())
        .end((error, res) => {
            if (error) throw error;
			if (res.statusCode != 200 || !res.ok) throw new Error('not ok: ' + res.statusCode);
			
			const videoRegex = /<th class="primary">[^]*?<a href="\/lecture\/video\/(\d.*)\/"[^]*?<\/i>([^]*?)<\/a>/g;
			for(let video, i = 1; (video = videoRegex.exec(res.text)) != null; i++) {
				const videoId = video[1];
				const videoName = video[2].trim();
				console.log(`Found "${videoName}" -> ${videoId}`);
				if(fetch) fetchSlides(videoId, i);
			}
        });
}