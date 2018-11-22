var fs = require('fs');
var glob = require('glob');
const gaze = require('gaze');
carga();

//desmontar para correr autonomo
//        migaze = gaze('../cdn.landing.engine/templates_sources/**/*.tpl', (err, watcher) => {
//    const watched = watcher.watched();
//    watcher.on('all', (event, filepath) => {
//        carga();
//    });
//});
function carga() {
    //borrar antiguos (genera error)
    const util = require('util');
    const glob = util.promisify(require('glob'));

   /* glob('../cdn.landing.engine/templates/*.php', function(err, files) {
        files.forEach(function(element) {
            fs.unlink(element, function(){})
        });
    }).then(function(){console.log("done")});*/

    glob('../cdn.landing.engine/templates_sources/**/*.tpl', function(err, files) {
                    files.forEach(function(element) {
                        lee_plantilla(element);
                    });
                });

}
function lee_plantilla(template) {
    fs.readFile(template, (err, data, isdone) => {
        data = data.toString().replace(" ", "");
        if (data.charAt(data.length - 1) != "\n\n") {
            data += "\n"
        }
        if (data.split(/[\r|\n]+/).length > 1) {
            var index = 0;
            data.split(/[\r|\n]+/).forEach(function(line) {
                index++;
                switch (index) {
                    case 1:
                        codigo = fs.readFileSync("../cdn.landing.engine/templates_sources/base/" + line + ".php");
                        break;
                    case data.split(/[\r|\n]+/).length:
                        //
                        escribe_php(codigo.toString(), template.split("/").pop())
                        break;
                    default:
                        codigo = interpreta(codigo.toString(), line, template);
                        break;
                }
            })
        } else {
            fs.readFile("../cdn.landing.engine/templates_sources/base/" + data.toString() + ".php", (err, data, isdone) => {
                escribe_php(data.toString(), template.split("/").pop())
            })
        }
    })
}
function escribe_php(contenido, destino) {

    fs.writeFile("../cdn.landing.engine/templates/" + destino.replace(".tpl", ".php"), limpiatags(contenido), function(err) {console.log("error"+err )});
}
function interpreta(codigo, linea, template) {
    if (linea.indexOf('+') > -1) {
        divisor = linea.indexOf('+');
        var operador = "+";
    }
    if (linea.indexOf('>') > -1) {
        divisor = linea.indexOf('>');
        var operador = ">";
    }
    if (linea.indexOf('-') > -1) {
        divisor = linea.indexOf('-');
        var operador = "-";
    }
    var origen = linea.slice(0, divisor);
    var destino = linea.slice(divisor + 1, linea.length);
    var formula = new RegExp("<\\?php#" + origen + "\\?>((?!<\\?php#\\/\\?>).|\\r\\n|\\r|\\n)*<\\?php#\\/" + origen + "\\?>");
    console.log(template);
   console.log(formula)
    switch (operador) {
        case "+":
            new_code = fs.readFileSync("../cdn.landing.engine/templates_sources/mods/" + destino + ".php");
            var a = codigo.match(formula).slice(0, -1);
            return codigo.replace(a, (a + new_code));
            break;
        case ">":
            new_code = fs.readFileSync("../cdn.landing.engine/templates_sources/mods/" + destino + ".php");
            var a = codigo.match(formula).slice(0, -1);
            return codigo.replace(a, new_code);
            break;
        case "-":
            var a = codigo.match(formula).slice(0, -1);
            return codigo.replace(a, "");
            break;
    }
}

function limpiatags(codigo){
    var formula = new RegExp("<\\?php#((?!>).)*\\?>", "g");
    var a = codigo.match(formula);

        if (a) {
            if (a.length > 0) {
                for (var i = 0, l = a.length; i < l; i++) {
                        codigo = codigo.replace(a[i], "")
                }
            }
        }


        codigo= codigo.replace(/^(?:[\t ]*(?:\r?\n|\r))+/gm, "")
        //codigo = codigo.replace(/(\r\n|\n|\r)/gm,"");
    console.log("match "+a);
 return codigo;
}
