#!/usr/bin/env node
const check = require('check-more-types');
const makeRss = require('./make-rss-src.js');

if (process.argv.length !== 5) {
    console.log('Usage: node make-rss.js <feed.xml> <beer-data.json> <tinkering-data.json>');
    process.exit(-1);
} else {
    // make sure we're dealing with json data files
    if (process.argv[3].split('.').pop() !== 'json' || process.argv[4].split('.').pop() !== 'json') {
        console.log('Input files should be json!');
        console.log('Usage: node make-rss.js <feed.xml> <beer-data.json> <tinkering-data.json>');
        process.exit(-1);
    } else {
        makeRss(process.argv[2], process.argv[3], process.argv[4]);
    }
}

check.fn(makeRss);