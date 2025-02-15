const fs = require('fs');

function makeRss(outputFilePath, beerDataJson, tinkeringDataJson) {
    const beerData = JSON.parse(fs.readFileSync(beerDataJson, "utf8"));
    const tinkeringData = JSON.parse(fs.readFileSync(tinkeringDataJson, "utf8"));

    // build a consolidated array of objects for sorting by date
    let feedArray = [];
    let beerUrl = new URL('https://nikolaimakes.beer/beer-details.html');
    let tinkeringUrl = new URL('https://nikolaimakes.beer/tinkering-details.html');

    // beer data first
    beerData.beerData.forEach((beer) => {
        let beerDt = new Date(Date.parse(beer.startDate));
        let beerMon = beerDt.toLocaleString('default', { month: 'short' });
        let beerYr = beerDt.getFullYear();
        beerUrl.searchParams.set('beer', beer.id);
        feedArray.push(
            {
                "title": `${beerMon} ${beerYr} - ${beer.name}`,
                "link": `${beerUrl}`,
                "description": `${beer.beerType}`,
                "date": beerDt
            }
        );
    });

    // then Tinkering Data
    tinkeringData.tinkeringData.forEach((tinkering) => {
        let tinkeringDt = new Date(Date.parse(tinkering.entryDate));
        let tinkeringMon = tinkeringDt.toLocaleString('default', { month: 'short' });
        let tinkeringYr = tinkeringDt.getFullYear();
        tinkeringUrl.searchParams.set('tinkering', tinkering.id);
        feedArray.push(
            {
                "title": `${tinkeringMon} ${tinkeringYr} - ${tinkering.title}`,
                "link": `${tinkeringUrl}`,
                "description": `A post about tinkering: ${tinkering.title}`,
                "date": tinkeringDt
            }
        );
    });

    // sort feed array
    feedArray.sort(function(a,b){
        return b.date - a.date;
    });

    // initialize XML
    let feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
        <channel>
            <title>Nikolai Makes Beer</title>
            <link>https://nikolaimakes.beer</link>
            <description>A page about beers nikolai makes and other stuff</description>
            <language>en-us</language>
    `;
    // create feed items
    feedArray.forEach((item) => {
        feedXml += `
            <item>
                <title>${item.title}</title>
                <link>${item.link}</link>
                <description>${item.description}</description>
            </item>
        `;
    });

    // closing tags
    feedXml += `
        </channel>
        </rss>
    `;

    // save to file
    fs.writeFileSync(outputFilePath,feedXml);
    console.log("RSS Feed XML file created successfully.");
}

module.exports = makeRss;