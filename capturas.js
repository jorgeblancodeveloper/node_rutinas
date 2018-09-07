const puppeteer = require('puppeteer');
var config = require('./adwebs-design/list_prod.json');
var miurl = Array.from(config.sites);
var mis_sizes = Array.from(config.sizes);
const miselector = Array.from(config.sizes);
require('events').EventEmitter.defaultMaxListeners = 100;
var prot = "www.";
var dest = "pantallazos/";
var g_stories;
var index = 0;
const runGulpTask = require('run-gulp-task');
const {
    TimeoutError
} = require('puppeteer/Errors');
async function getPic(esta) {
    esta = "http://" + prot + esta;
    var sal = 0;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setExtraHTTPHeaders({
        Referer: esta
    })
    await page.setViewport({
        width: config.sizes[0],
        height: config.sizes[1],
        deviceScaleFactor: 1
    });
    try {
        await page.goto(esta, {
            waitUntil: 'load',
            timeout: 1000
        })
    } catch (e) {
        sal = 1;
    }

    if (sal == 0) {
        await page.waitFor(1000)
        /* ------- DESCOMENTAR PARA CAPTURAR SECCIONES--------
        await page.waitForSelector('nav li a', {
            waitUntil: 'load',
            timeout: 1000
        });
        const stories = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('nav li a'))
            return links.map(link => link.href).slice(0, 10)
        })
        for (var i = 0; i < stories.length; i++) {
            await page.goto(stories[i]);
            await page.waitFor(1500)
            await page.screenshot({
                path: dest + esta.slice(8) + "_" + stories[i].split("/").pop().replace(".htm", "") + ".png"
            });
        }
        //---------------------------------------------------*/
        await page.screenshot({
            path: dest + esta.slice(7 + prot.length) + "_" + config.sizes[0] + 'x' + config.sizes[1] + '.png'
        });
    }
    await browser.close();
}

arranca = setInterval(function() {
    index++;
    if (index > miurl.length) {
        if (prot == "www.") {
            prot = "www0.";
            dest = "pantallazos_stagging/";
            index = 0;
        } else {
            clearInterval(arranca);
            runGulpTask('filestojson', 'gulpfile.js')
                .then(() => {
                    console.log("acabado, comparo");
                    runGulpTask('compara', 'gulpfile.js');
                })
                .catch(e => {
                    console.log("error " + e);
                })
        }
    }
    getPic(miurl[index]);
}, 2000);


/* formato del JSON

{
"sizes" : [ 1366, 700],
"selector" : [".nav.navbar-nav li a"],
"sites" : [
"link.com",
"link.com",
"link.com"
]}

/*