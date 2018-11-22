const puppeteer = require('puppeteer');
var config = {
  "sizes" : [  480,  1000],
  "selector" : [".nav.navbar-nav li a"],
  "sites" : [
"24gameonline.com",
"actualidad-viral.com",
"actualidadmasviral.com",
"actualmente-viral.com",
"adwebstest.com",
"all-games.in",
"all-supergames.com",
"all2game.com",
"tuttigossip.com",
"tuttitest.com",
"tuttiviral.com",
"tuttivirali.com",
"tutto-apps.com",
"tutto-giocare.com",
"universo-fitness.com",
"video-divertenti.mobi",
"videos-chingones.com",
"videos-chistosos.mobi",
"videos-cool-funny.com",
"videos-cool-viral.com",
"videos-engracadinhos.com",
"videos-for-fun.com",
"videos-graciosos.com",
"videos-muito-engracados.com",
"videos-padrisimos.com",
"videos-per-tutti.com",
"videos-top.com",
"videos-virais.com",
"videos-virales.mobi",
"videosdroles.mobi",
"videosengracadostv.com",
"videosforlaugh.com",
"videosgraciososvirales.com",
"videosyrisas.com",
"videoviralidivertenti.com",
"vip-gossip.com",
"viral-4-all.com",
"viral-access.com",
"viral-addictive.com",
"viral-mix.com",
"viral-ones.com",
"viral-time.com",
"viral-vip.com",
"viral2you.com",
"virales-locos.com",
"viraletplus.com",
"viralisch.com",
"virals-fun.com",
"vive-les-jeux.com",
"vivelesrecettes.com",
"wonderful-lifestyle.com",
"zonalifestyle.com"
]
}
var miurl = Array.from(config.sites);
var mis_sizes = Array.from(config.sizes);
const miselector = Array.from(config.sizes);
require('events').EventEmitter.defaultMaxListeners = 100;
var prot = "www.";
var dest = "site/pantallazos/";
var g_stories;
var index = 0;
const runGulpTask = require('run-gulp-task');

var looksSame = require('looks-same');
var glob = require('glob');
var miglobal = {
    "images": []
}
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
            timeout: 4000
        })
    } catch (e) {
        sal = 1;
        console.log("error tipo" + e+" en "+esta)
    }
    if (sal == 0) {
        await page.waitFor(2000)
            /* ------- DESCOMENTAR PARA CAPTURAR SECCIONES--------

			try {
            await page.waitForSelector('nav li a', {
                waitUntil: 'load',
                timeout: 1000
            });
    } catch (e) {
        console.log("error en "+esta+" "+e)= 1;
          process.send("error en "+esta+" "+e)
    }

            const stories = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('nav li a'))
                return links.map(link => link.href).slice(0, 10)
            })
            for (var i = 0; i < stories.length; i++) {
                await page.goto(stories[i]);
                await page.waitFor(1500)
                await page.screenshot({
                    path:dest + esta.slice(8) + "_" + stories[i].split("/").pop().replace(".htm", "") + ".png"
                });
            }
            //---------------------------------------------------*/
        await page.screenshot({
            path: dest + esta.slice(7 + prot.length) + ".png"        });
//        process.send("<div class='thumb'>" + index + " de " + miurl.length + "<img src='" + "/pantallazos/" + esta.slice(7 + prot.length) + "_" + config.sizes[0] + 'x' + config.sizes[1] + ".png'></div>");
        process.send("<div class='thumb'>" + index + " de " + miurl.length + "<img src='" + "/pantallazos/" + esta.slice(7 + prot.length) + ".png'></div>");
    }
    await browser.close();
}


arranca = setInterval(function() {
    index++;
    //console.log(index + " de " + miurl.length);

    if (index > miurl.length) {
        if (prot == "www.") {
            console.log("cambio www")
            prot = "www0.";
            dest = "site/pantallazos_stagging/";
            index = 0;
        } else {



            clearInterval(arranca);
            console.log("acabado, compara");
            glob('./site/pantallazos/**.png', function(err, files) {
                if (err) {
                    process.send("Error: " + err);
                } else {
                    config = files;
                    miglobal.images = Array.from(config);
                    compara(0);
                }
            });


        }
    }
    getPic(miurl[index]);
}, 1500);

function compara(i) {
    var origen = miglobal.images[i];
    var destino = miglobal.images[i].replace('pantallazos', 'pantallazos_stagging');
    var dif = miglobal.images[i].replace('pantallazos', 'pantallazos_dif');
    looksSame(origen, destino, function(error, equal) {
        if (error){
            console.log(error);
        }
        if (!equal) {
            looksSame.createDiff({
                reference: origen,
                current: destino,
                diff: dif,
                highlightColor: '#ff00ff',
                strict: true
            }, function(error) {
                console.log("un error " + error)
            })
        } else {
            console.log(i + " son iguales");
        }
    });
    i++;
    if (i < miglobal.images.length) {
        compara(i)
    } else {
         process.send("finito");
         process.send("resultados en carpeta diff");
    }
}
