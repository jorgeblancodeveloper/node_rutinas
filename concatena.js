var fs = require('fs');
var glob = require('glob');
var path = require('path');

global.landing = {
    it: [],
    fr: [],
    es: []
};

global.files = {
    it: [],
    fr: [],
    es: []
};

global.common = {
    it: "",
    fr: "",
    es: ""
};
global.paises = ["es", "fr", "it"];
global.pais = 0;
carga(0);

function carga(temp) {
    process.send("empiezo con " + paises[temp]);
    glob(path.normalize(path.resolve(__dirname, '../cdn.landing.engine/' + paises[temp] + '/**/theme.css')), function(err, files) {
        if (err) {
            process.send("Error: " + err);
        } else {
            global.files[paises[temp]] = files;
            ejecuta(pais)
        }
    });
}

function ejecuta(pais) {
    lee(paises[pais]), final()
}

function final() {
    if ((paises.length - 1) > pais) {
        pais++;
        carga(pais);
    } else {
        console.log("he acabado");
    }
}
//* para usar desde interfaz web
/*process.on('message', function(m) {
  console.log('CHILD got message:', m);

});*/

//*/
function lee(mipais) {
    fs.readFile(path.normalize(path.resolve(__dirname, '../cdn.landing.engine/css/' + mipais + '/common.css')), (err, data, isdone) => {
        if (err) {
            process.send("No encuentro common " + err);
            common[mipais] = "/* NOCOMMON */";
            arranca(mipais)
        } else {
            common[mipais] = "/*COMMON:" + mipais + ":*/ \n" + data.toString();
            arranca(mipais)
        }
    })
}

function arranca(mipais) {
    for (index in files[mipais]) {
        global.landing[mipais].push(files[mipais][index].split("/").splice(-3, 1).toString());
        lee_template(index, mipais);
    }
}

function lee_template(indice, mipais) {
    fs.readFile(path.resolve(__dirname, '../cdn.landing.engine/' + mipais + '/') + "/" + files[mipais][indice].split("/")[6] + "/template.php", (err, data, isdone) => {
        if (err) {
            process.send("No encuentro template " + indice + " " + mipais + " " + err);
        } else {
            lee_css_plantilla(data.toString().replace("<?php include PATH_LANDINGS_TEMPLATE_COMMON . '", "").replace(".php'; ?>", ".css"), indice, mipais)
        }
    })
}

function lee_css_plantilla(miurl, miindice, mipais) {
    for (index in aliascss) {
        if (aliascss[index].indexOf(miurl) != -1) {
            miurl = aliascss[index][0];
        }
    }

    fs.readFile(path.resolve(__dirname, '../cdn.landing.engine/templates/css/') + "/" + miurl.replace(".php'; ?>", ".css"), (err, data, isdone) => {
        if (err) {
            process.send("No encuentro css del template " + " " + " miindice " + landing[mipais][miindice] + " mipais " + mipais);
            //   console.log(path.resolve(__dirname, '../cdn.landing.engine/templates/css/')  +"/" + miurl.replace(".php'; ?>", ".css"));
            var temp = "/* NOTEMPLATE */ \n" + common[mipais];
            lee_theme(temp, miindice, miurl, mipais);
        } else {
            //     console.log("SI XXX encuentro css del template " + miurl + " miindice "+miindice+" mipais "+mipais );
            //    console.log("si encuentro "+path.resolve(__dirname, '../cdn.landing.engine/templates/css/')  +"/" + miurl.replace(".php'; ?>", ".css"));
            var temp = "/*TEMPLATE:" + miurl + ":*/ \n" + data.toString() + common[mipais];
            lee_theme(temp, miindice, miurl, mipais);
        }
    })
}

function lee_theme(micss, miindice, miurl, mipais) {
    //console.log(mipais)
    fs.readFile(path.resolve(__dirname, '../cdn.landing.engine/' + mipais + '/') + '/' + landing[mipais][miindice] + "/css/theme.css", 'utf8', (err, data, isdone) => {
        if (err) {
            process.send("No encuentro theme" + miurl.replace(".css", "") + " " + err);
        } else {
            data = data.toString().replace("\ï»¿", "");
            micss = micss + "/*THEME:" + landing[mipais][miindice] + ":*/\n \n \n" + data;
            escribe(micss, miindice, mipais);
        }
    })
}

function escribe(texto, indice, mipais) {
    //  console.log("escribo "+mipais+" "+indice);
    fs.writeFile(path.resolve(__dirname, '../cdn.landing.engine/' + mipais + '/') + '/' + landing[mipais][indice] + '/css/compiled.css', texto.replace("\ï»¿", ""), function(err) {
        if (err) {
            return process.send("Error en escritura " + err)
        } else {
            console.log("global " + global.landing[mipais].length + "indice " + indice)
            if (global.landing[mipais].length < (indice + 2)) {
                process.send("finito");
            }
        };
    });
}

var aliascss = {
    "es_ipx_main.css": ["es_ipx_main.css", "es_ipx_disclaimer"],
    "fr_wifi_3g_image_thumbs.css": ["fr_wifi_3g_image_thumbs.css", "fr_wifi_3g_image.css", "fr_mobiyo_wifi_3g_image.css", "fr_flat_wifi_3g_image_thumbs.css", "fr_wifi_3g_select.css", "fr_mobiyo_wifi_3g_image_nobutton.css", "fr_mobiyo_wifi_3g_image_thumbs.css", "fr_wifi_3g_select_02.css", "fr_wifi_3g_image_txt.css", "fr_wifi_3g_horoscope.css", "fr_wifi_3g_select_4.css", "fr_wifi_3g_select_zodiac.css", "fr_wifi_3g_select_zodiac_dual.css", "fr_wifi_3g_image_no_button.css", "full_img_arrow_thumbs.css", "wifi_3g_image_arrow_thumbs_2col_fr.css", "fr-assets/full_img_arrow_thumbs.css", "fr_adsl_image.css"],
    "fr_wifi_3g_various_images_thumbs.css": ["fr_wifi_3g_image_thumbs.css", "fr_wifi_3g_image_thumbs_test.css", "fr_wifi_3g_various_images_thumbs_test.css"]
}
