"use strict";

const Superagent = require('superagent');
const Stack = require('stackjs');
const Path = require('path');
const FS = require('fs');

const sanitizeFilename = require("sanitize-filename");
const unescapeHtml = require('unescape');
const mkdirs = require('node-mkdirs');

const {ttUrl, savePath, skipExisting, throttle} = require('./settings.js');

module.exports = (videoId, prefixNr) => {
    const vUrl = `${ttUrl}/lecture/video/${videoId}/`;
    Superagent.get(vUrl)
        .use(throttle.plugin())
        .end((error, res) => {
            if (error) throw error;
            if (res.statusCode != 200 || !res.ok) throw new Error('not ok: ' + res.statusCode);

            const seriesMatch = /<h5 .*?<a href.*?>(.*?)<\/a>/.exec(res.text);
            const series = sanitizeFilename(!seriesMatch ? 'unknown' : seriesMatch[1]);
            const titleMatch = /<title>(.*?)<\/title>/.exec(res.text);
            const title = sanitizeFilename((prefixNr ? prefixNr + ' ' : '') + (!titleMatch ? videoId : titleMatch[1]));
            const path = `${savePath}/${series}/${title}`;
            if (!FS.existsSync(path)) mkdirs(path);
			console.log(`Fetching "${vUrl}" -> "${path}"`);

            const htmlMatch = /<video-player configuration='(.*?)'><\/video-player>/.exec(res.text);
            if (!htmlMatch) throw new Error('video config not found', res.text);
            const data = JSON.parse(unescapeHtml(htmlMatch[1], 'all'));

            const chapters = new Stack();
            data.chapters
                .map((c, i) => {
                    c.index = i + 1;
                    return c;
                })
                .reverse()
                .forEach(c => chapters.push(c));
            let currentChapter = chapters.peek();

            data.slides
                // .slice(0, 2)
                .map(o => o.thumbnail)
                .map(p => `${ttUrl}${p}`)
                .forEach((tUrl, i) => {
                    const onlineFile = Path.parse(tUrl);
                    const pos = parseInt(onlineFile.name);
                    while (!chapters.isEmpty() && pos > chapters.peek().startPosition) {
                        currentChapter = chapters.pop();
                    }
                    const filename = sanitizeFilename(`${currentChapter.index} ${currentChapter.title} ${onlineFile.base}`);
                    const localFile = `${path}/${filename}`;
                    if (FS.existsSync(localFile) && skipExisting) return;

                    Superagent.get(tUrl)
                        .use(throttle.plugin())
                        .end((err, res) => {
                            FS.writeFile(localFile, res.body, err => {
                                const msg = `Saving "${tUrl}" -> "${localFile}"`;
                                if (!err) console.log(msg);
                                else console.error(msg, err);
                            });
                        });
                });
        });
};